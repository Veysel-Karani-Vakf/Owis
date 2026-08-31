-- =============================================================================
-- Project "contribute" buttons go straight to the in-site payment checkout
-- (/donate/checkout/<slug>) instead of the donate catalogue. Project slugs
-- match donation_opportunities slugs (blessed-tree, waqf-share, gold-wallet).
-- Re-runnable. Run after 0006.
-- =============================================================================

update public.projects
  set official_contribution_url = '/donate/checkout/' || slug
  where official_contribution_url = '/donate';

-- CTA copy said "via the in-site contribute page"; it is the payment page now.
-- Guarded by the exact old Arabic text so admin-edited copy is never clobbered.
update public.projects
  set cta_description = jsonb_build_object(
    'ar', 'تتم المساهمة في هذا المشروع عبر بوابة الدفع الآمنة داخل الموقع.',
    'tr', 'Bu projeye katkı, site içindeki güvenli ödeme sayfası üzerinden yapılır.',
    'en', 'Contribution to this project goes through the secure in-site payment page.'
  )
  where slug = 'blessed-tree'
    and cta_description->>'ar' = 'تتم المساهمة في هذا المشروع حالياً عبر صفحة المساهمة داخل الموقع.';

update public.projects
  set cta_description = jsonb_build_object(
    'ar', 'تتم المساهمة في السهم الوقفي عبر بوابة الدفع الآمنة داخل الموقع.',
    'tr', 'Vakıf Hissesine katkı, site içindeki güvenli ödeme sayfası üzerinden yapılır.',
    'en', 'Contribution to the Waqf Share goes through the secure in-site payment page.'
  )
  where slug = 'waqf-share'
    and cta_description->>'ar' = 'تتم المساهمة في السهم الوقفي حالياً عبر صفحة المساهمة داخل الموقع.';

update public.projects
  set cta_description = jsonb_build_object(
    'ar', 'تتم المساهمة في محفظة الذهب عبر بوابة الدفع الآمنة داخل الموقع.',
    'tr', 'Vakıf Altın Portföyüne katkı, site içindeki güvenli ödeme sayfası üzerinden yapılır.',
    'en', 'Contribution to the Gold Portfolio goes through the secure in-site payment page.'
  )
  where slug = 'gold-wallet'
    and cta_description->>'ar' = 'تتم المساهمة في محفظة الذهب حالياً عبر صفحة المساهمة داخل الموقع.';

-- The stored home page's project cards: each card's contribute link follows
-- its details link (/projects/<slug> → /donate/checkout/<slug>) in every
-- locale that stores the section. Admin-entered custom links are untouched.
do $$
declare
  loc text;
  items jsonb;
begin
  foreach loc in array array['ar', 'tr', 'en'] loop
    select data #> array[loc, 'projects', 'items'] into items
      from public.site_pages where key = 'home';
    if items is not null and jsonb_typeof(items) = 'array' then
      update public.site_pages
        set data = jsonb_set(data, array[loc, 'projects', 'items'], (
          select jsonb_agg(
            case
              when item->>'contributionUrl' = '/donate' and item->>'detailsUrl' like '/projects/%'
                then jsonb_set(
                  item,
                  '{contributionUrl}',
                  to_jsonb(replace(item->>'detailsUrl', '/projects/', '/donate/checkout/'))
                )
              else item
            end)
          from jsonb_array_elements(items) as item
        ))
        where key = 'home';
    end if;
  end loop;
end $$;
