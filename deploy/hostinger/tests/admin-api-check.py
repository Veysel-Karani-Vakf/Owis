#!/usr/bin/env python3
"""Checks this server's own database, storage and sign-in service the way the
site and its dashboard use them. Run as root on the server:

    python3 admin-api-check.py

Three parts:
  visitor        what anyone may read, and what must stay closed to them
  administrator  add, change and remove a record and a file, read the inboxes
  sign-in        the service answers, refuses unknown accounts and new sign-ups

The administrator part signs a token that lives five minutes for an existing
administrator, with this server's own signing secret; nothing is typed and no
password is involved. Everything the check creates carries "migration-check" in
its name and is removed again before it ends. Nothing is printed that is secret.
"""
import base64
import hashlib
import hmac
import json
import subprocess
import sys
import time
import urllib.error
import urllib.request

ROOT = "/opt/owis"
GATEWAY = "http://127.0.0.1:8000"
STAMP = time.strftime("%Y%m%d%H%M%S", time.gmtime())
TAG = "migration-check"

failures = []
checks = 0


def setting(path, name):
    for line in open(path):
        if line.startswith(name + "="):
            return line.split("=", 1)[1].strip().strip("'")
    sys.exit("missing %s in %s" % (name, path))


def sql(query):
    out = subprocess.run(
        ["docker", "exec", "supabase-db", "psql", "-At", "-U", "supabase_admin", "-h", "localhost", "-d", "postgres", "-c", query],
        capture_output=True, text=True, check=True,
    )
    return out.stdout.strip()


def b64(data):
    return base64.urlsafe_b64encode(data).rstrip(b"=")


def token_for(user_id, secret):
    now = int(time.time())
    head = b64(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode())
    body = b64(json.dumps({
        "sub": user_id, "role": "authenticated", "aud": "authenticated", "iss": "supabase",
        "iat": now, "exp": now + 300, "app_metadata": {}, "user_metadata": {},
    }, separators=(",", ":")).encode())
    signature = b64(hmac.new(secret.encode(), head + b"." + body, hashlib.sha256).digest())
    return (head + b"." + body + b"." + signature).decode()


def call(method, url, key, bearer=None, body=None, headers=None):
    """Returns (status, body bytes, response headers)."""
    send = {"apikey": key, "Authorization": "Bearer " + (bearer or key)}
    data = None
    if isinstance(body, (dict, list)):
        data = json.dumps(body).encode()
        send["Content-Type"] = "application/json"
    elif body is not None:
        data = body
    send.update(headers or {})
    request = urllib.request.Request(url, data=data, method=method, headers=send)
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.status, response.read(), dict(response.headers)
    except urllib.error.HTTPError as error:
        return error.code, error.read(), dict(error.headers)
    except Exception as error:  # reported as a failed check
        return 0, str(error).encode(), {}


def check(label, passed, detail=""):
    global checks
    checks += 1
    if passed:
        print("ok    " + label)
    else:
        failures.append(label)
        print("FAIL  %s %s" % (label, detail))


def rows(body):
    try:
        value = json.loads(body or b"null")
    except ValueError:
        return None
    return value if isinstance(value, list) else None


def total(headers):
    """Row count PostgREST reports in Content-Range ("0-0/87")."""
    value = headers.get("Content-Range") or headers.get("content-range") or ""
    return value.rsplit("/", 1)[-1] if "/" in value else ""


def main():
    anon = setting(ROOT + "/staging.env", "SUPABASE_ANON_KEY")
    site = setting(ROOT + "/staging.env", "PUBLIC_SITE_URL").rstrip("/")
    secret = setting(ROOT + "/supabase-staging/.env", "JWT_SECRET")
    admin_id = sql("select user_id from public.admin_users order by created_at limit 1")
    if not admin_id:
        sys.exit("no administrator in public.admin_users")
    admin = token_for(admin_id, secret)
    rest = GATEWAY + "/rest/v1"
    storage = GATEWAY + "/storage/v1"
    auth = GATEWAY + "/auth/v1"
    expected = {
        name: sql("select count(*) from public.%s" % name)
        for name in ("news", "donation_payments", "award_applications", "participate_submissions")
    }
    slug = "zz-%s-%s" % (TAG, STAMP)
    picture = "%s/%s.png" % (TAG, STAMP)
    document = "%s/%s.txt" % (TAG, STAMP)
    png = base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    )

    try:
        print("== visitor (the public key only) ==")
        status, body, _ = call("GET", rest + "/news?select=slug&is_published=eq.true&limit=1", anon)
        check("published news can be read", status == 200 and bool(rows(body)), "(HTTP %s)" % status)
        for table in ("donation_payments", "award_applications", "participate_submissions", "admin_users", "newsletter_subscribers"):
            status, body, _ = call("GET", rest + "/%s?select=*&limit=1" % table, anon)
            closed = status in (401, 403) or (status == 200 and rows(body) == [])
            check("%s shows nothing to a visitor" % table, closed, "(HTTP %s)" % status)
        status, _, _ = call("POST", rest + "/news", anon, body={"slug": slug + "-visitor"})
        check("a visitor cannot add news", status in (401, 403), "(HTTP %s)" % status)
        status, _, _ = call("POST", storage + "/object/media/%s/visitor.png" % TAG, anon, body=png,
                            headers={"Content-Type": "image/png"})
        check("a visitor cannot upload a file", status in (400, 401, 403), "(HTTP %s)" % status)

        print("== administrator ==")
        status, body, _ = call("POST", rest + "/news", anon, admin,
                               body={"slug": slug, "title": {"ar": "فحص النقل"}, "is_published": False},
                               headers={"Prefer": "return=representation"})
        created = rows(body) or []
        check("add a news item", status == 201 and len(created) == 1, "(HTTP %s)" % status)
        news_id = created[0]["id"] if created else ""
        status, body, _ = call("PATCH", rest + "/news?id=eq." + news_id, anon, admin,
                               body={"title": {"ar": "فحص النقل — معدّل"}},
                               headers={"Prefer": "return=representation"})
        changed = rows(body) or []
        check("change it", status == 200 and len(changed) == 1 and "معدّل" in changed[0]["title"].get("ar", ""),
              "(HTTP %s)" % status)
        # Not a pass/fail matter of this server: the read rule of the content
        # tables is the project's own ("public read", open), and the pages
        # filter on is_published. Reported so that it is known.
        status, body, _ = call("GET", rest + "/news?select=id&slug=eq." + slug, anon)
        if status == 200 and rows(body) == []:
            print("note  an unpublished item is hidden from visitors by the database")
        else:
            print("note  an unpublished item can be read through the data API by a visitor "
                  "(the content tables' read rule is open; only the pages filter on is_published)")
        status, _, _ = call("DELETE", rest + "/news?id=eq." + news_id, anon, admin)
        check("remove it", status in (200, 204), "(HTTP %s)" % status)
        check("it is gone from the database", sql("select count(*) from public.news where slug = '%s'" % slug) == "0")

        for table in ("news", "donation_payments", "award_applications", "participate_submissions"):
            status, _, headers = call("GET", rest + "/%s?select=id" % table, anon, admin,
                                      headers={"Prefer": "count=exact", "Range-Unit": "items", "Range": "0-0"})
            check("the administrator sees all %s rows of %s" % (expected[table], table),
                  status in (200, 206) and total(headers) == expected[table],
                  "(HTTP %s, reported %s)" % (status, total(headers) or "nothing"))

        status, _, _ = call("POST", storage + "/object/media/" + picture, anon, admin, body=png,
                            headers={"Content-Type": "image/png", "x-upsert": "true"})
        check("upload a picture to the public library", status == 200, "(HTTP %s)" % status)
        status, body, headers = call("GET", "%s/storage/v1/object/public/media/%s" % (site, picture), anon)
        check("the picture is served on the site's own address", status == 200 and body == png, "(HTTP %s)" % status)
        status, _, _ = call("DELETE", storage + "/object/media/" + picture, anon, admin)
        check("remove the picture", status == 200, "(HTTP %s)" % status)
        status, _, _ = call("GET", "%s/storage/v1/object/public/media/%s" % (site, picture), anon)
        check("the removed picture is no longer served", status in (400, 404), "(HTTP %s)" % status)

        status, _, _ = call("POST", storage + "/object/submissions/" + document, anon, admin, body=b"migration check\n",
                            headers={"Content-Type": "text/plain", "x-upsert": "true"})
        check("upload a private attachment", status == 200, "(HTTP %s)" % status)
        status, _, _ = call("GET", "%s/storage/v1/object/public/submissions/%s" % (site, document), anon)
        check("the private attachment has no public address", status in (400, 404), "(HTTP %s)" % status)
        status, body, _ = call("POST", storage + "/object/sign/submissions/" + document, anon, admin, body={"expiresIn": 60})
        signed = ""
        try:
            signed = json.loads(body).get("signedURL", "")
        except ValueError:
            pass
        check("the dashboard gets a signed link for it", status == 200 and signed.startswith("/object/sign/"), "(HTTP %s)" % status)
        status, body, _ = call("GET", storage + signed, anon) if signed else (0, b"", {})
        check("the signed link opens the attachment", status == 200 and body == b"migration check\n", "(HTTP %s)" % status)
        status, _, _ = call("DELETE", storage + "/object/submissions/" + document, anon, admin)
        check("remove the attachment", status == 200, "(HTTP %s)" % status)

        print("== sign-in service ==")
        status, _, _ = call("GET", auth + "/health", anon)
        check("the sign-in service answers", status == 200, "(HTTP %s)" % status)
        status, body, _ = call("GET", auth + "/settings", anon)
        try:
            closed = json.loads(body).get("disable_signup") is True
        except ValueError:
            closed = False
        check("new sign-ups are closed", status == 200 and closed, "(HTTP %s)" % status)
        status, _, _ = call("POST", auth + "/token?grant_type=password", anon,
                            body={"email": "nobody@%s.invalid" % TAG, "password": "not-an-account-" + STAMP})
        check("an unknown account is refused", status == 400, "(HTTP %s)" % status)
        status, _, _ = call("POST", auth + "/signup", anon,
                            body={"email": "nobody@%s.invalid" % TAG, "password": "not-an-account-" + STAMP})
        check("a sign-up attempt is refused", status in (400, 403, 422), "(HTTP %s)" % status)
        signed_in = sql("select count(*) from auth.users where last_sign_in_at > now() - interval '1 day'")
        print("note  accounts that signed in on this server during the last day: " + signed_in)
    finally:
        # Whatever happened above, leave nothing behind.
        sql("delete from public.news where slug like 'zz-%s-%%'" % TAG)
        left = sql("select count(*) from storage.objects where name like '%s/%%'" % TAG)
        if left != "0":
            service = setting(ROOT + "/staging.env", "SUPABASE_SERVICE_ROLE_KEY")
            for bucket in ("media", "submissions"):
                names = sql("select name from storage.objects where bucket_id = '%s' and name like '%s/%%'" % (bucket, TAG))
                for name in filter(None, names.split("\n")):
                    call("DELETE", "%s/object/%s/%s" % (storage, bucket, name), service)
        left = sql("select (select count(*) from public.news where slug like 'zz-%s-%%') + (select count(*) from storage.objects where name like '%s/%%')" % (TAG, TAG))
        print("left behind by this check: " + left)

    if failures:
        print("ADMIN_API_CHECK_FAILED: %d of %d checks" % (len(failures), checks))
        sys.exit(1)
    print("ADMIN_API_CHECK_OK: %d checks" % checks)


if __name__ == "__main__":
    main()
