import React, { useEffect, useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Users,
  Network,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Check,
  X,
  UserPlus,
  MoveRight,
  ExternalLink,
  Shield,
  Briefcase,
  AlertCircle,
  FolderTree,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/i18n/useI18n';
import type { Locale, OrgSectionRow, OrgPersonRow, OrgMembershipRow } from '@/lib/types';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';
import { MediaPicker } from './MediaPicker';
import { hydrateCms } from '@/cms/hydrate';
import { setPublished } from '@/cms/store';
import type { AreaTone } from '../lib/siteMap';

type OrgStructureManagerProps = {
  tone?: AreaTone;
};

type LocalizedText = {
  ar: string;
  tr: string;
  en: string;
};

const emptyLocalized = (): LocalizedText => ({ ar: '', tr: '', en: '' });

export default function OrgStructureManager({ tone }: OrgStructureManagerProps) {
  const { locale, isRtl } = useI18n();
  const toast = useToast();
  const confirm = useConfirm();

  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<OrgSectionRow[]>([]);
  const [people, setPeople] = useState<OrgPersonRow[]>([]);
  const [memberships, setMemberships] = useState<OrgMembershipRow[]>([]);

  // Expanded section in the accordion / view
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

  // Section Modal State
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionForm, setSectionForm] = useState<{
    id?: string;
    slug: string;
    title: LocalizedText;
    description: LocalizedText;
    layout_type: 'chart' | 'cards';
    sort_order: number;
    is_published: boolean;
  }>({
    slug: '',
    title: emptyLocalized(),
    description: emptyLocalized(),
    layout_type: 'cards',
    sort_order: 1,
    is_published: true,
  });

  // Member Modal State
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [isExistingPersonMode, setIsExistingPersonMode] = useState(false);
  const [selectedExistingPersonId, setSelectedExistingPersonId] = useState<string>('');

  const [memberForm, setMemberForm] = useState<{
    membershipId?: string;
    personId?: string;
    sectionId: string;
    personSlug: string;
    name: LocalizedText;
    shortName: LocalizedText;
    image: string;
    imagePosition: string;
    roleTitle: LocalizedText;
    level: 1 | 2 | 3;
    parentId: string | null;
    shortBio: LocalizedText;
    fullBio: LocalizedText;
    sortOrder: number;
    isPublished: boolean;
  }>({
    sectionId: '',
    personSlug: '',
    name: emptyLocalized(),
    shortName: emptyLocalized(),
    image: '',
    imagePosition: 'center 20%',
    roleTitle: emptyLocalized(),
    level: 3,
    parentId: null,
    shortBio: emptyLocalized(),
    fullBio: emptyLocalized(),
    sortOrder: 1,
    isPublished: true,
  });

  // Move member modal state
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [membershipToMove, setMembershipToMove] = useState<OrgMembershipRow | null>(null);
  const [targetSectionId, setTargetSectionId] = useState<string>('');

  // Active form locale tab in modals
  const [formLocale, setFormLocale] = useState<Locale>('ar');

  const [isPagePublished, setIsPagePublished] = useState<boolean>(true);
  const [togglingPageVisibility, setTogglingPageVisibility] = useState(false);

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      const [secRes, peoRes, memRes, pageRes] = await Promise.all([
        supabase.from('org_sections').select('*').order('sort_order', { ascending: true }),
        supabase.from('org_people').select('*').order('created_at', { ascending: true }),
        supabase.from('org_memberships').select('*').order('sort_order', { ascending: true }),
        supabase.from('site_pages').select('data').eq('key', 'administrative-structure').maybeSingle(),
      ]);

      if (secRes.error) throw secRes.error;
      if (peoRes.error) throw peoRes.error;
      if (memRes.error) throw memRes.error;

      const loadedSections = secRes.data ?? [];
      setSections(loadedSections);
      setPeople(peoRes.data ?? []);
      setMemberships(memRes.data ?? []);

      if (pageRes.data?.data) {
        const pData = pageRes.data.data as Record<string, any>;
        const pub = pData.is_published !== false && pData.published !== false && pData.ar?.is_published !== false;
        setIsPagePublished(pub);
      }

      // Auto expand first section if none is expanded
      if (!expandedSectionId && loadedSections.length > 0) {
        setExpandedSectionId(loadedSections[0].id);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'فشل تحميل بيانات الهيكل الإداري');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePageVisibility = async () => {
    const next = !isPagePublished;
    const ok = await confirm({
      title: next
        ? L('إظهار صفحة الهيكل الإداري للزوار', 'İdari Yapı Sayfasını Yayına Al', 'Publish Administrative Structure Page')
        : L('إخفاء صفحة الهيكل الإداري عن الزوار', 'İdari Yapı Sayfasını Gizle', 'Hide Administrative Structure Page'),
      body: next
        ? L('سيتم تفعيل ظهور الصفحة وإتاحتها لجميع زوار الموقع مع إظهار الرابط في القائمة الرئيسية.', 'Sayfa tüm ziyaretçilere açılacak ve ana menüde görünecektir.', 'The page will be published and accessible to all visitors, and shown in the main menu.')
        : L('سيتم إخفاء الصفحة عن الزوار وعرض رسالة تنبيهية مناسبة، كما سيتم إخفاء الرابط من القائمة الرئيسية مؤقتاً.', 'Sayfa ziyaretçilerden gizlenecek, uygun bir bakım mesajı gösterilecek ve menüden geçici olarak gizlenecektir.', 'The page will be hidden from public visitors with a friendly maintenance message, and hidden from the main menu temporarily.'),
      confirmLabel: next ? L('نشر الصفحة', 'Yayına Al', 'Publish') : L('إخفاء الصفحة', 'Gizle', 'Hide'),
      destructive: !next,
    });
    if (!ok) return;

    setTogglingPageVisibility(true);
    try {
      const { data: pageRow } = await supabase
        .from('site_pages')
        .select('key, label, data')
        .eq('key', 'administrative-structure')
        .maybeSingle();

      const currentData = (pageRow?.data as Record<string, any>) || {};
      const updatedData = {
        ...currentData,
        is_published: next,
        published: next,
        ar: { ...(currentData.ar || {}), is_published: next, published: next },
        tr: { ...(currentData.tr || {}), is_published: next, published: next },
        en: { ...(currentData.en || {}), is_published: next, published: next },
      };

      const { error: upsertErr } = await supabase
        .from('site_pages')
        .upsert(
          {
            key: 'administrative-structure',
            label: pageRow?.label || { ar: 'الهيكل الإداري', tr: 'İdari Yapı', en: 'Administrative Structure' },
            data: updatedData,
          },
          { onConflict: 'key' },
        );

      if (upsertErr) throw upsertErr;

      setIsPagePublished(next);
      toast.success(
        next
          ? L('تم إظهار ونشر صفحة الهيكل الإداري بنجاح', 'Sayfa başarıyla yayına alındı', 'Page published successfully')
          : L('تم إخفاء صفحة الهيكل الإداري عن الزوار بنجاح', 'Sayfa ziyaretçilerden gizlendi', 'Page hidden from visitors successfully'),
      );
      refreshCms();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'حدث خطأ أثناء تعديل حالة ظهور الصفحة');
    } finally {
      setTogglingPageVisibility(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshCms = () => {
    hydrateCms()
      .then((snapshot) => setPublished(snapshot))
      .catch(() => {});
  };

  // Maps for rapid lookup
  const peopleMap = useMemo(() => new Map(people.map((p) => [p.id, p])), [people]);
  const sectionsMap = useMemo(() => new Map(sections.map((s) => [s.id, s])), [sections]);

  // UI labels helper
  const L = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  // --------------------------------------------------------------------------
  // SECTION ACTIONS
  // --------------------------------------------------------------------------
  const handleOpenAddSection = () => {
    setSectionForm({
      slug: '',
      title: emptyLocalized(),
      description: emptyLocalized(),
      layout_type: 'cards',
      sort_order: sections.length + 1,
      is_published: true,
    });
    setFormLocale(locale);
    setSectionModalOpen(true);
  };

  const handleOpenEditSection = (section: OrgSectionRow, e: React.MouseEvent) => {
    e.stopPropagation();
    setSectionForm({
      id: section.id,
      slug: section.slug,
      title: {
        ar: section.title?.ar ?? '',
        tr: section.title?.tr ?? '',
        en: section.title?.en ?? '',
      },
      description: {
        ar: section.description?.ar ?? '',
        tr: section.description?.tr ?? '',
        en: section.description?.en ?? '',
      },
      layout_type: section.layout_type ?? 'cards',
      sort_order: section.sort_order ?? 1,
      is_published: section.is_published,
    });
    setFormLocale(locale);
    setSectionModalOpen(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.title.ar && !sectionForm.title.tr && !sectionForm.title.en) {
      toast.error(L('يرجى إدخال عنوان الهيئة على الأقل بلغة واحدة', 'Lütfen en az bir dilde heyet başlığını girin', 'Please enter section title in at least one language'));
      return;
    }

    const slug = sectionForm.slug.trim() ||
      (sectionForm.title.en || sectionForm.title.tr || sectionForm.title.ar)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `section-${Date.now()}`;

    try {
      if (sectionForm.id) {
        // Update
        const { error } = await supabase
          .from('org_sections')
          .update({
            slug,
            title: sectionForm.title,
            description: sectionForm.description,
            layout_type: sectionForm.layout_type,
            sort_order: sectionForm.sort_order,
            is_published: sectionForm.is_published,
          })
          .eq('id', sectionForm.id);
        if (error) throw error;
        toast.success(L('تم حفظ بيانات الهيئة بنجاح', 'Heyet başarıyla güncellendi', 'Section updated successfully'));
      } else {
        // Create
        const { error } = await supabase.from('org_sections').insert({
          slug,
          title: sectionForm.title,
          description: sectionForm.description,
          layout_type: sectionForm.layout_type,
          sort_order: sectionForm.sort_order,
          is_published: sectionForm.is_published,
        });
        if (error) throw error;
        toast.success(L('تم إنشاء الهيئة الجديدة بنجاح', 'Yeni heyet başarıyla oluşturuldu', 'New section created successfully'));
      }

      setSectionModalOpen(false);
      await loadData();
      refreshCms();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ الهيئة');
    }
  };

  const handleDeleteSection = async (section: OrgSectionRow, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = await confirm({
      title: L(`حذف "${section.title?.[locale] || section.slug}"`, `"${section.title?.[locale] || section.slug}" Heyetini Sil`, `Delete "${section.title?.[locale] || section.slug}"`),
      body: L(
        'هل أنت متأكد من حذف هذه الهيئة؟ سيتم إلغاء العضويات التابعة لها في هذه الهيئة فقط، وستبقى بيانات وسير الأشخاص محفوظة في قاعدة البيانات دون أي حذف.',
        'Bu heyeti silmek istediğinizden emin misiniz? Yalnızca bu heyete ait üyelikler kaldırılacak; kişisel profiller ve biyografiler veritabanında korunacaktır.',
        'Are you sure you want to delete this section? Only memberships belonging to this body will be removed; personal member profiles and biographies will remain safely preserved in the database.',
      ),
      confirmLabel: L('نعم، احذف الهيئة', 'Evet, Heyeti Sil', 'Yes, Delete Section'),
      cancelLabel: L('إلغاء', 'İptal', 'Cancel'),
      destructive: true,
    });

    if (!confirmed) return;

    try {
      const { error } = await supabase.from('org_sections').delete().eq('id', section.id);
      if (error) throw error;
      toast.success(L('تم حذف الهيئة بنجاح', 'Heyet başarıyla silindi', 'Section deleted successfully'));
      await loadData();
      refreshCms();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'فشل حذف الهيئة');
    }
  };

  const handleToggleSectionPublish = async (section: OrgSectionRow, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const nextPublished = !section.is_published;
      const { error } = await supabase
        .from('org_sections')
        .update({ is_published: nextPublished })
        .eq('id', section.id);
      if (error) throw error;
      toast.success(
        nextPublished
          ? L('تم تفعيل ظهور الهيئة على الموقع', 'Heyet sitede yayına alındı', 'Section published on site')
          : L('تم إخفاء الهيئة من الموقع', 'Heyet siteden gizlendi', 'Section hidden from site'),
      );
      await loadData();
      refreshCms();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'فشل تحديث حالة النشر');
    }
  };

  const handleMoveSection = async (section: OrgSectionRow, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const index = sections.findIndex((s) => s.id === section.id);
    if (index < 0) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const otherSection = sections[targetIndex];
    const order1 = otherSection.sort_order;
    const order2 = section.sort_order;

    try {
      await Promise.all([
        supabase.from('org_sections').update({ sort_order: order1 }).eq('id', section.id),
        supabase.from('org_sections').update({ sort_order: order2 }).eq('id', otherSection.id),
      ]);
      await loadData();
      refreshCms();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'فشل تغيير الترتيب');
    }
  };

  // --------------------------------------------------------------------------
  // MEMBER ACTIONS
  // --------------------------------------------------------------------------
  const handleOpenAddMember = (sectionId: string) => {
    const secMembers = memberships.filter((m) => m.section_id === sectionId);
    setIsExistingPersonMode(false);
    setSelectedExistingPersonId('');
    setMemberForm({
      sectionId,
      personSlug: '',
      name: emptyLocalized(),
      shortName: emptyLocalized(),
      image: '',
      imagePosition: 'center 20%',
      roleTitle: emptyLocalized(),
      level: 3,
      parentId: null,
      shortBio: emptyLocalized(),
      fullBio: emptyLocalized(),
      sortOrder: secMembers.length + 1,
      isPublished: true,
    });
    setFormLocale(locale);
    setMemberModalOpen(true);
  };

  const handleOpenEditMember = (membership: OrgMembershipRow, e: React.MouseEvent) => {
    e.stopPropagation();
    const person = peopleMap.get(membership.person_id);
    setIsExistingPersonMode(false);
    setSelectedExistingPersonId(membership.person_id);

    setMemberForm({
      membershipId: membership.id,
      personId: membership.person_id,
      sectionId: membership.section_id,
      personSlug: person?.slug ?? '',
      name: {
        ar: person?.name?.ar ?? '',
        tr: person?.name?.tr ?? '',
        en: person?.name?.en ?? '',
      },
      shortName: {
        ar: person?.short_name?.ar ?? '',
        tr: person?.short_name?.tr ?? '',
        en: person?.short_name?.en ?? '',
      },
      image: person?.image ?? '',
      imagePosition: person?.image_position ?? 'center 20%',
      roleTitle: {
        ar: membership.role_title?.ar ?? '',
        tr: membership.role_title?.tr ?? '',
        en: membership.role_title?.en ?? '',
      },
      level: (membership.level as 1 | 2 | 3) || 3,
      parentId: membership.parent_id,
      shortBio: {
        ar: person?.short_bio?.ar ?? '',
        tr: person?.short_bio?.tr ?? '',
        en: person?.short_bio?.en ?? '',
      },
      fullBio: {
        ar: person?.full_bio?.ar ?? '',
        tr: person?.full_bio?.tr ?? '',
        en: person?.full_bio?.en ?? '',
      },
      sortOrder: membership.sort_order ?? 1,
      isPublished: membership.is_published,
    });
    setFormLocale(locale);
    setMemberModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isExistingPersonMode && !selectedExistingPersonId) {
      toast.error(L('يرجى اختيار شخص من القائمة', 'Lütfen listeden bir kişi seçin', 'Please select a person from the list'));
      return;
    }

    if (!isExistingPersonMode && !memberForm.personId) {
      if (!memberForm.name.ar && !memberForm.name.tr && !memberForm.name.en) {
        toast.error(L('يرجى كتابة اسم الشخص على الأقل بلغة واحدة', 'Lütfen en az bir dilde kişi adını girin', 'Please enter person name in at least one language'));
        return;
      }
    }

    try {
      let finalPersonId = memberForm.personId;

      if (isExistingPersonMode) {
        finalPersonId = selectedExistingPersonId;
      } else {
        // Save or update person record
        const slug = memberForm.personSlug.trim() ||
          (memberForm.name.en || memberForm.name.tr || memberForm.name.ar)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') ||
          `person-${Date.now()}`;

        if (finalPersonId) {
          // Update person
          const { error: pErr } = await supabase
            .from('org_people')
            .update({
              name: memberForm.name,
              short_name: memberForm.shortName,
              image: memberForm.image || null,
              image_position: memberForm.imagePosition,
              short_bio: memberForm.shortBio,
              full_bio: memberForm.fullBio,
            })
            .eq('id', finalPersonId);
          if (pErr) throw pErr;
        } else {
          // Insert new person
          const { data: pData, error: pErr } = await supabase
            .from('org_people')
            .insert({
              slug,
              name: memberForm.name,
              short_name: memberForm.shortName,
              image: memberForm.image || null,
              image_position: memberForm.imagePosition,
              short_bio: memberForm.shortBio,
              full_bio: memberForm.fullBio,
            })
            .select('id')
            .single();
          if (pErr) throw pErr;
          finalPersonId = pData.id;
        }
      }

      if (!finalPersonId) throw new Error('Could not identify person record');

      // Now save or update membership record
      if (memberForm.membershipId) {
        // Update membership
        const { error: mErr } = await supabase
          .from('org_memberships')
          .update({
            role_title: memberForm.roleTitle,
            level: memberForm.level,
            parent_id: memberForm.parentId || null,
            sort_order: memberForm.sortOrder,
            is_published: memberForm.isPublished,
          })
          .eq('id', memberForm.membershipId);
        if (mErr) throw mErr;
        toast.success(L('تم حفظ بيانات العضو بنجاح', 'Üye bilgileri başarıyla güncellendi', 'Member updated successfully'));
      } else {
        // Insert membership
        const { error: mErr } = await supabase.from('org_memberships').insert({
          section_id: memberForm.sectionId,
          person_id: finalPersonId,
          role_title: memberForm.roleTitle,
          level: memberForm.level,
          parent_id: memberForm.parentId || null,
          sort_order: memberForm.sortOrder,
          is_published: memberForm.isPublished,
        });
        if (mErr) throw mErr;
        toast.success(L('تمت إضافة العضو إلى الهيئة بنجاح', 'Üye heyete başarıyla eklendi', 'Member added to section successfully'));
      }

      setMemberModalOpen(false);
      await loadData();
      refreshCms();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ العضو');
    }
  };

  const handleDeleteMember = async (membership: OrgMembershipRow, e: React.MouseEvent) => {
    e.stopPropagation();
    const person = peopleMap.get(membership.person_id);
    const confirmed = await confirm({
      title: L('إزالة العضو من الهيئة', 'Üyeyi Heyetten Çıkar', 'Remove Member from Section'),
      body: L(
        `هل أنت متأكد من إزالة "${person?.name?.[locale] || person?.slug || 'هذا العضو'}" من هذه الهيئة؟ سيبقى ملف الشخص وسيرته الذاتية محفوظة بأمان في النظام.`,
        `Bu üyeyi heyetten çıkarmak istediğinizden emin misiniz? Kişisel profil ve biyografi sistemde güvenle saklanmaya devam edecektir.`,
        `Are you sure you want to remove this member from this section? Their personal profile and biography will remain safely preserved in the system.`,
      ),
      confirmLabel: L('نعم، أزل العضو', 'Evet, Çıkar', 'Yes, Remove Member'),
      cancelLabel: L('إلغاء', 'İptal', 'Cancel'),
      destructive: true,
    });

    if (!confirmed) return;

    try {
      const { error } = await supabase.from('org_memberships').delete().eq('id', membership.id);
      if (error) throw error;
      toast.success(L('تمت إزالة العضو من الهيئة', 'Üye heyetten çıkarıldı', 'Member removed from section'));
      await loadData();
      refreshCms();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'فشل إزالة العضو');
    }
  };

  const handleToggleMemberPublish = async (membership: OrgMembershipRow, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const nextPublished = !membership.is_published;
      const { error } = await supabase
        .from('org_memberships')
        .update({ is_published: nextPublished })
        .eq('id', membership.id);
      if (error) throw error;
      toast.success(
        nextPublished
          ? L('تم تفعيل ظهور العضو على الموقع', 'Üye sitede yayına alındı', 'Member published on site')
          : L('تم إخفاء العضو من الموقع', 'Üye siteden gizlendi', 'Member hidden from site'),
      );
      await loadData();
      refreshCms();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'فشل تحديث حالة النشر');
    }
  };

  const handleMoveMemberOrder = async (
    membership: OrgMembershipRow,
    direction: 'up' | 'down',
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const secMembers = memberships
      .filter((m) => m.section_id === membership.section_id)
      .sort((a, b) => a.sort_order - b.sort_order);

    const index = secMembers.findIndex((m) => m.id === membership.id);
    if (index < 0) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= secMembers.length) return;

    const otherMem = secMembers[targetIndex];
    const order1 = otherMem.sort_order;
    const order2 = membership.sort_order;

    try {
      await Promise.all([
        supabase.from('org_memberships').update({ sort_order: order1 }).eq('id', membership.id),
        supabase.from('org_memberships').update({ sort_order: order2 }).eq('id', otherMem.id),
      ]);
      await loadData();
      refreshCms();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'فشل تغيير ترتيب العضو');
    }
  };

  const handleOpenMoveMemberModal = (membership: OrgMembershipRow, e: React.MouseEvent) => {
    e.stopPropagation();
    setMembershipToMove(membership);
    setTargetSectionId(membership.section_id);
    setMoveModalOpen(true);
  };

  const handleConfirmMoveMember = async () => {
    if (!membershipToMove || !targetSectionId || targetSectionId === membershipToMove.section_id) {
      setMoveModalOpen(false);
      return;
    }

    try {
      const targetSecMembers = memberships.filter((m) => m.section_id === targetSectionId);
      const nextOrder = targetSecMembers.length + 1;

      const { error } = await supabase
        .from('org_memberships')
        .update({
          section_id: targetSectionId,
          parent_id: null, // Clear hierarchy parent when moving across bodies
          sort_order: nextOrder,
        })
        .eq('id', membershipToMove.id);

      if (error) throw error;
      toast.success(L('تم نقل العضو إلى الهيئة المختارة بنجاح', 'Üye seçilen heyete başarıyla taşındı', 'Member moved to chosen section successfully'));
      setMoveModalOpen(false);
      setExpandedSectionId(targetSectionId);
      await loadData();
      refreshCms();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'فشل نقل العضو');
    }
  };

  const levelBadge = (lvl: number) => {
    switch (lvl) {
      case 1:
        return {
          label: L('المستوى الأول (رئاسة / قيادة عليا)', '1. Kademe (Başkan)', 'Level 1 (Leadership)'),
          color: 'bg-primary-50 text-primary-700 border-primary-200',
        };
      case 2:
        return {
          label: L('المستوى الثاني (إدارة تنفيذية)', '2. Kademe (Genel Müdür)', 'Level 2 (Executive)'),
          color: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      default:
        return {
          label: L('المستوى الثالث (أعضاء / إدارات)', '3. Kademe (Üyeler)', 'Level 3 (Members/Depts)'),
          color: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          <p className="text-sm font-medium">{L('جاري تحميل الهيكل الإداري...', 'İdari yapı yükleniyor...', 'Loading organizational structure...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner and Add Section Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl flex items-center gap-2">
            <Network className="h-5 w-5 text-primary-600" />
            <span>{L('إدارة الهيكل الإداري والهيئات التنظيمية', 'İdari Yapı ve Heyet Yönetimi', 'Organizational Structure & Bodies')}</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            {L(
              'التحكم الكامل في كافة هيئات ومجالس الوقف (الهيئة الإدارية، هيئة المتولين، مجلس الإدارة، هيئة الاستثمار)، وإضافة وتعديل وترتيب الأعضاء والتسلسل الهرمي.',
              'Vakfın tüm heyet ve kurullarını yönetin, yeni heyetler ve üyeler ekleyin, hiyerarşiyi ve sıralamayı kod değiştirmeden düzenleyin.',
              'Full control over all foundation bodies and boards, adding, editing, and reordering members and hierarchy without code changes.',
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddSection}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-700 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{L('إضافة هيئة / قسم جديد', 'Yeni Heyet Ekle', 'Add New Section')}</span>
        </button>
      </div>

      {/* Page Visibility Control Card */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 shadow-xs transition-all ${
          isPagePublished
            ? 'border-emerald-200 bg-emerald-50/50'
            : 'border-amber-200 bg-amber-50/60'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-xs ${
              isPagePublished ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
            }`}
          >
            {isPagePublished ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base font-bold text-slate-900">
                {L(
                  'حالة ظهور صفحة الهيكل الإداري على الموقع للزوار',
                  'İdari Yapı Sayfasının Ziyaretçilere Görünürlük Durumu',
                  'Administrative Structure Page Public Visibility',
                )}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                  isPagePublished
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isPagePublished ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'
                  }`}
                />
                {isPagePublished
                  ? L('الصفحة منشورة ومتاحة للزوار', 'Sayfa Yayında (Görünür)', 'Page Published & Public')
                  : L('الصفحة مخفية مؤقتاً عن الزوار', 'Sayfa Gizli (Bakım Modunda)', 'Page Hidden from Public')}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
              {isPagePublished
                ? L(
                    'الصفحة متاحة لجميع زوار الموقع، ورابطها معروض في القائمة المنسدلة "عن الوقف".',
                    'Sayfa tüm ziyaretçilere açık ve "Hakkında" menüsünde listelenmektedir.',
                    'The page is accessible to all visitors and listed in the "About" navigation menu.',
                  )
                : L(
                    'الصفحة مخفية عن الزوار وتُعرض لهم رسالة صيانة مؤقتة، ورابطها مخفي تلقائياً من قوائم الموقع.',
                    'Sayfa ziyaretçilerden gizlendi ve bakım mesajı gösterilmektedir; bağlantısı menüden kaldırıldı.',
                    'The page is hidden from public visitors with a friendly maintenance message and omitted from site menus.',
                  )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
          <a
            href="/about/structure"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            <span>{L('معاينة الصفحة', 'Sayfayı Önizle', 'Preview Page')}</span>
          </a>

          <button
            type="button"
            disabled={togglingPageVisibility}
            onClick={handleTogglePageVisibility}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold shadow-sm transition disabled:opacity-60 cursor-pointer ${
              isPagePublished
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {togglingPageVisibility ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : isPagePublished ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>{L('إخفاء الصفحة عن الزوار', 'Sayfayı Gizle', 'Hide from Public')}</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>{L('إظهار ونشر الصفحة للزوار', 'Sayfayı Yayına Al', 'Publish Page')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {sections.map((section, sIdx) => {
          const isExpanded = expandedSectionId === section.id;
          const sectionMembers = memberships
            .filter((m) => m.section_id === section.id)
            .sort((a, b) => a.sort_order - b.sort_order);

          return (
            <div
              key={section.id}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isExpanded
                  ? 'border-slate-300 bg-white shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Section Header Accordion Bar */}
              <div
                onClick={() => setExpandedSectionId(isExpanded ? null : section.id)}
                className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer bg-slate-50/60 hover:bg-slate-50 transition-colors select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 font-bold text-slate-700 shadow-2xs">
                    {sIdx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                        {section.title?.[locale] || section.slug}
                      </h3>

                      {/* Layout badge */}
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        {section.layout_type === 'chart' ? (
                          <>
                            <Network className="h-3 w-3 text-primary-600" />
                            <span>{L('مخطط شجري هرمي', 'Şema Hiyerarşik', 'Hierarchical Chart')}</span>
                          </>
                        ) : (
                          <>
                            <LayoutGrid className="h-3 w-3 text-slate-500" />
                            <span>{L('بطاقات أعضاء', 'Üye Kartları', 'Member Cards')}</span>
                          </>
                        )}
                      </span>

                      {/* Visibility badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border ${
                          section.is_published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {section.is_published ? L('منشور', 'Yayında', 'Published') : L('مخفي', 'Gizli', 'Hidden')}
                      </span>

                      {/* Members count */}
                      <span className="text-xs text-slate-400 font-medium">
                        ({sectionMembers.length} {L('أعضاء', 'üye', 'members')})
                      </span>
                    </div>

                    {section.description?.[locale] && (
                      <p className="mt-1 text-xs sm:text-sm text-slate-500 line-clamp-1">
                        {section.description[locale]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Section Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Reorder Buttons */}
                  <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
                    <button
                      type="button"
                      disabled={sIdx === 0}
                      onClick={(e) => handleMoveSection(section, 'up', e)}
                      title={L('تحريك لأعلى', 'Yukarı taşı', 'Move Up')}
                      className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={sIdx === sections.length - 1}
                      onClick={(e) => handleMoveSection(section, 'down', e)}
                      title={L('تحريك لأسفل', 'Aşağı taşı', 'Move Down')}
                      className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Toggle publish */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleSectionPublish(section, e)}
                    title={section.is_published ? L('إخفاء من الموقع', 'Siteden Gizle', 'Hide') : L('نشر على الموقع', 'Sitede Yayınla', 'Publish')}
                    className={`rounded-lg border p-1.5 text-xs transition ${
                      section.is_published
                        ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                        : 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }`}
                  >
                    {section.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>

                  {/* Edit section */}
                  <button
                    type="button"
                    onClick={(e) => handleOpenEditSection(section, e)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                    <span className="hidden sm:inline">{L('تعديل الهيئة', 'Düzenle', 'Edit')}</span>
                  </button>

                  {/* Delete section */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSection(section, e)}
                    className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition"
                    title={L('حذف الهيئة', 'Heyeti Sil', 'Delete Section')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Expand / collapse chevron */}
                  <div className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>
              </div>

              {/* Section Body (Members Management) */}
              {isExpanded && (
                <div className="border-t border-slate-200 p-4 sm:p-6 bg-white space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary-600" />
                        <span>{L(`أعضاء ${section.title?.[locale] || section.slug}`, `${section.title?.[locale] || section.slug} Üyeleri`, `Members of ${section.title?.[locale] || section.slug}`)}</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {section.layout_type === 'chart'
                          ? L('تظهر هذه الهيئة بهيكل هرمي مترابط. يمكنك تحديد الرئيس والمدير التنفيذي ومسؤولي الإدارات والتسلسل الإداري.', 'Bu heyet hiyerarşik şema olarak görünür. Üst yönetici ve kademeleri belirleyebilirsiniz.', 'This body renders as a hierarchical chart. You can configure leadership and reporting lines.')
                          : L('تظهر هذه الهيئة ببطاقات متوازية أنيقة بدون خطوط تبعية إدارية.', 'Bu heyet eşit üyelerden oluşan kartlar olarak görünür.', 'This body renders as clean member cards without hierarchical reporting lines.')}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenAddMember(section.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-2xs self-start sm:self-auto"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>{L('إضافة عضو لهذه الهيئة', 'Heyete Üye Ekle', 'Add Member to Body')}</span>
                    </button>
                  </div>

                  {/* Members list */}
                  {sectionMembers.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                      <Users className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                      <p className="text-sm font-semibold text-slate-600">
                        {L('لا يوجد أعضاء في هذه الهيئة حتى الآن', 'Bu heyette henüz üye bulunmamaktadır', 'No members in this section yet')}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                        {L('انقر على "إضافة عضو لهذه الهيئة" لإضافة قيادات وأعضاء جدد أو ربط شخص مسجل مسبقاً في الوقف.', 'Yeni üye eklemek veya kayıtlı kişiyi bağlamak için yukarıdaki butonu kullanın.', 'Click "Add Member to Body" to add new leadership or link an existing profile.')}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleOpenAddMember(section.id)}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{L('إضافة العضو الأول', 'İlk Üyeyi Ekle', 'Add First Member')}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sectionMembers.map((mem, mIdx) => {
                        const person = peopleMap.get(mem.person_id);
                        const lvlInfo = levelBadge(mem.level);
                        const parentMembership = mem.parent_id
                          ? memberships.find((m) => m.id === mem.parent_id)
                          : null;
                        const parentPerson = parentMembership
                          ? peopleMap.get(parentMembership.person_id)
                          : null;

                        return (
                          <div
                            key={mem.id}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-xl border p-3.5 transition-all ${
                              mem.is_published
                                ? 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                                : 'border-slate-200 bg-slate-50/70 opacity-80'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Member photo */}
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xs">
                                {person?.image ? (
                                  <img
                                    src={person.image}
                                    alt={person.name?.[locale] || ''}
                                    className="h-full w-full object-cover"
                                    style={{ objectPosition: person.image_position || 'center 20%' }}
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                                    <Users className="h-5 w-5" />
                                  </div>
                                )}
                              </div>

                              {/* Member Details */}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="font-bold text-slate-900 text-sm truncate">
                                    {person?.name?.[locale] || person?.slug || '—'}
                                  </h5>

                                  {/* Position pill */}
                                  <span className="inline-block rounded-md bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary-700 border border-primary-100">
                                    {mem.role_title?.[locale] || L('بدون صفة', 'Görevi Yok', 'No title')}
                                  </span>

                                  {/* Level pill */}
                                  <span
                                    className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold border ${lvlInfo.color}`}
                                  >
                                    {lvlInfo.label}
                                  </span>

                                  {/* Parent indicator if hierarchical */}
                                  {parentPerson && (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5">
                                      <FolderTree className="h-3 w-3 text-slate-400" />
                                      <span>
                                        {L('يتبع:', 'Bağlı:', 'Reports to:')}{' '}
                                        {parentPerson.name?.[locale] || parentPerson.slug}
                                      </span>
                                    </span>
                                  )}
                                </div>

                                {person?.short_bio?.[locale] && (
                                  <p className="mt-0.5 text-xs text-slate-500 line-clamp-1 max-w-xl">
                                    {person.short_bio[locale]}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Member Actions */}
                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                              {/* Reorder Buttons */}
                              <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
                                <button
                                  type="button"
                                  disabled={mIdx === 0}
                                  onClick={(e) => handleMoveMemberOrder(mem, 'up', e)}
                                  title={L('تحريك لأعلى', 'Yukarı', 'Move Up')}
                                  className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={mIdx === sectionMembers.length - 1}
                                  onClick={(e) => handleMoveMemberOrder(mem, 'down', e)}
                                  title={L('تحريك لأسفل', 'Aşağı', 'Move Down')}
                                  className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              {/* Toggle publish */}
                              <button
                                type="button"
                                onClick={(e) => handleToggleMemberPublish(mem, e)}
                                title={mem.is_published ? L('إخفاء من الموقع', 'Gizle', 'Hide') : L('نشر على الموقع', 'Yayınla', 'Publish')}
                                className={`rounded-lg border p-1.5 text-xs transition ${
                                  mem.is_published
                                    ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                                    : 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                                }`}
                              >
                                {mem.is_published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                              </button>

                              {/* Move to another section */}
                              <button
                                type="button"
                                onClick={(e) => handleOpenMoveMemberModal(mem, e)}
                                title={L('نقل إلى هيئة أخرى', 'Başka Heyete Taşı', 'Move to another section')}
                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                              >
                                <MoveRight className="h-3.5 w-3.5" />
                              </button>

                              {/* Edit member */}
                              <button
                                type="button"
                                onClick={(e) => handleOpenEditMember(mem, e)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                              >
                                <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                                <span>{L('تعديل', 'Düzenle', 'Edit')}</span>
                              </button>

                              {/* Remove member */}
                              <button
                                type="button"
                                onClick={(e) => handleDeleteMember(mem, e)}
                                title={L('إزالة من الهيئة', 'Heyetten Çıkar', 'Remove from Body')}
                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          SECTION EDIT/CREATE MODAL
         ========================================================================= */}
      {sectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                {sectionForm.id
                  ? L('تعديل بيانات الهيئة', 'Heyeti Düzenle', 'Edit Section')
                  : L('إضافة هيئة تنظيمية جديدة', 'Yeni Heyet Ekle', 'Add New Section')}
              </h3>
              <button
                type="button"
                onClick={() => setSectionModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4">
              {/* Language switcher tab */}
              <div className="flex gap-1 rounded-xl bg-slate-100 p-1 mb-2">
                {(['ar', 'tr', 'en'] as Locale[]).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setFormLocale(loc)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                      formLocale === loc
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {loc === 'ar' ? 'العربية' : loc === 'tr' ? 'Türkçe' : 'English'}
                  </button>
                ))}
              </div>

              {/* Title per selected locale */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {L('عنوان الهيئة / المجلس', 'Heyet / Kurul Başlığı', 'Section Title')} ({formLocale.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  required={formLocale === 'ar'}
                  value={sectionForm.title[formLocale]}
                  onChange={(e) =>
                    setSectionForm({
                      ...sectionForm,
                      title: { ...sectionForm.title, [formLocale]: e.target.value },
                    })
                  }
                  placeholder={
                    formLocale === 'ar'
                      ? 'مثال: هيئة المتولين'
                      : formLocale === 'tr'
                      ? 'Örnek: Mütevelli Heyeti'
                      : 'e.g. Board of Trustees'
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>

              {/* Description per selected locale */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {L('الوصف ومسؤوليات الهيئة', 'Heyet Açıklaması ve Görevleri', 'Section Description')} ({formLocale.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={sectionForm.description[formLocale]}
                  onChange={(e) =>
                    setSectionForm({
                      ...sectionForm,
                      description: { ...sectionForm.description, [formLocale]: e.target.value },
                    })
                  }
                  placeholder={
                    formLocale === 'ar'
                      ? 'نبذة تعريفية عن اختصاصات ومسؤوليات الهيئة...'
                      : formLocale === 'tr'
                      ? 'Heyetin görev ve yetkileri hakkında kısa açıklama...'
                      : 'Brief description of section responsibilities...'
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>

              {/* Slug identifier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {L('المعرّف التقني (Slug)', 'Benzersiz Tanımlayıcı (Slug)', 'Identifier (Slug)')}
                </label>
                <input
                  type="text"
                  value={sectionForm.slug}
                  onChange={(e) => setSectionForm({ ...sectionForm, slug: e.target.value })}
                  placeholder="e.g. board-of-trustees"
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  {L('يُستخدم لربط الهيكل والتسلسل في النظام. يمكن تركه فارغاً للتوليد التلقائي.', 'Sistemde bağlantı için kullanılır. Otomatik oluşturma için boş bırakabilirsiniz.', 'Used for unique identification. Leave empty to auto-generate.')}
                </p>
              </div>

              {/* Layout Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {L('نمط عرض الهيئة', 'Görünüm Düzeni', 'Display Layout Type')} *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setSectionForm({ ...sectionForm, layout_type: 'chart' })}
                    className={`cursor-pointer rounded-xl border p-3 flex items-start gap-2.5 transition ${
                      sectionForm.layout_type === 'chart'
                        ? 'border-primary-600 bg-primary-50/50 text-primary-900 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Network className="h-5 w-5 shrink-0 mt-0.5 text-primary-600" />
                    <div>
                      <div className="font-bold text-xs sm:text-sm">
                        {L('شجرة هيكل تنظيمي', 'Hiyerarşik Şema', 'Hierarchical Chart')}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {L('مخطط هرمي مع خطوط ربط (مثل الهيئة الإدارية)', 'Bağlantı çizgileriyle liderlik şeması', 'Tree with connector lines')}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSectionForm({ ...sectionForm, layout_type: 'cards' })}
                    className={`cursor-pointer rounded-xl border p-3 flex items-start gap-2.5 transition ${
                      sectionForm.layout_type === 'cards'
                        ? 'border-primary-600 bg-primary-50/50 text-primary-900 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <LayoutGrid className="h-5 w-5 shrink-0 mt-0.5 text-slate-600" />
                    <div>
                      <div className="font-bold text-xs sm:text-sm">
                        {L('بطاقات أعضاء', 'Üye Kartları', 'Member Cards')}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {L('شبكة بطاقات أعضاء متوازية بدون خطوط هرمية', 'Çizgisiz bağımsız üye kartları', 'Clean card grid')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Publication toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="section_published"
                  checked={sectionForm.is_published}
                  onChange={(e) => setSectionForm({ ...sectionForm, is_published: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="section_published" className="text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                  {L('نشر هذه الهيئة على الموقع العام', 'Bu heyeti sitede yayınla', 'Publish this section on the public site')}
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSectionModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {L('إلغاء', 'İptal', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-primary-700 transition"
                >
                  {L('حفظ الهيئة', 'Heyeti Kaydet', 'Save Section')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MEMBER EDIT/CREATE MODAL
         ========================================================================= */}
      {memberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                {memberForm.membershipId
                  ? L('تعديل بيانات العضو', 'Üyeyi Düzenle', 'Edit Member')
                  : L('إضافة عضو جديد للهيئة', 'Heyete Yeni Üye Ekle', 'Add Member to Section')}
              </h3>
              <button
                type="button"
                onClick={() => setMemberModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4">
              {/* If creating new membership, allow choosing an existing person from directory */}
              {!memberForm.membershipId && people.length > 0 && (
                <div className="flex rounded-xl bg-slate-100 p-1 mb-3">
                  <button
                    type="button"
                    onClick={() => setIsExistingPersonMode(false)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                      !isExistingPersonMode
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {L('تسجيل شخص جديد بالكامل', 'Yeni Kişi Oluştur', 'Create New Person')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExistingPersonMode(true)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                      isExistingPersonMode
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {L('اختيار شخص مسجل مسبقاً في الوقف', 'Kayıtlı Kişiyi Seç', 'Select Existing Person')}
                  </button>
                </div>
              )}

              {/* If existing person mode is on */}
              {isExistingPersonMode && (
                <div className="rounded-xl border border-primary-200 bg-primary-50/40 p-4 space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    {L('اختر الشخص من السجلات الحالية:', 'Kayıtlı kişilerden birini seçin:', 'Choose person from directory:')} *
                  </label>
                  <select
                    value={selectedExistingPersonId}
                    onChange={(e) => setSelectedExistingPersonId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  >
                    <option value="">{L('-- اختر شخصاً --', '-- Kişi Seçin --', '-- Select Person --')}</option>
                    {people.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name?.[locale] || p.slug}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500">
                    {L('سيتم ربط هذا الشخص بالهيئة مع تحديد منصبه الخاص بهذه الهيئة دون تكرار ملفه الشخصي.', 'Bu kişi aynı profil ile bu heyete atanacaktır.', 'This person will be linked with their role in this body without duplicating their profile.')}
                  </p>
                </div>
              )}

              {/* Language switcher tab for localized fields */}
              {!isExistingPersonMode && (
                <div className="flex gap-1 rounded-xl bg-slate-100 p-1 mb-2">
                  {(['ar', 'tr', 'en'] as Locale[]).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setFormLocale(loc)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                        formLocale === loc
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {loc === 'ar' ? 'العربية' : loc === 'tr' ? 'Türkçe' : 'English'}
                    </button>
                  ))}
                </div>
              )}

              {/* Person Fields (Name, Photo, Bios) - only when NOT existing person mode */}
              {!isExistingPersonMode && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {L('الاسم الكامل', 'Ad Soyad', 'Full Name')} ({formLocale.toUpperCase()}) *
                      </label>
                      <input
                        type="text"
                        required={formLocale === 'ar'}
                        value={memberForm.name[formLocale]}
                        onChange={(e) =>
                          setMemberForm({
                            ...memberForm,
                            name: { ...memberForm.name, [formLocale]: e.target.value },
                          })
                        }
                        placeholder={
                          formLocale === 'ar'
                            ? 'مثال: أ/ صلاح باتيس'
                            : formLocale === 'tr'
                            ? 'Örn: Salah Batiss'
                            : 'e.g. Salah Batiss'
                        }
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      />
                    </div>

                    {/* Short Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {L('الاسم المختصر للعرض', 'Kısa Ad', 'Short Name')} ({formLocale.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={memberForm.shortName[formLocale]}
                        onChange={(e) =>
                          setMemberForm({
                            ...memberForm,
                            shortName: { ...memberForm.shortName, [formLocale]: e.target.value },
                          })
                        }
                        placeholder="اختياري"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Profile Photo with MediaPicker & Framing Position */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {L('الصورة الشخصية', 'Profil Görseli', 'Profile Photo')}
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
                          {memberForm.image ? (
                            <img
                              src={memberForm.image}
                              alt="preview"
                              className="h-full w-full object-cover"
                              style={{ objectPosition: memberForm.imagePosition }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <ImageIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={memberForm.image}
                            onChange={(e) => setMemberForm({ ...memberForm, image: e.target.value })}
                            placeholder="/media/... أو رابط الصورة"
                            dir="ltr"
                            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-600 focus:border-primary-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setMediaPickerOpen(true)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs shrink-0"
                          >
                            {L('اختيار / رفع صورة', 'Görsel Seç / Yükle', 'Pick / Upload Image')}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {L('محاذاة الوجه في الصورة', 'Görsel Hizalama', 'Portrait Framing')}
                      </label>
                      <select
                        value={memberForm.imagePosition}
                        onChange={(e) => setMemberForm({ ...memberForm, imagePosition: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-primary-500 focus:outline-none mt-1.5"
                      >
                        <option value="center 10%">{L('أعلى (10%)', 'Üst (10%)', 'Top (10%)')}</option>
                        <option value="center 20%">{L('أعلى منتصف (20% - افتراضي)', 'Üst Orta (20%)', 'Upper Center (20%)')}</option>
                        <option value="center 35%">{L('منتصف علوي (35%)', 'Orta Üst (35%)', 'Mid Upper (35%)')}</option>
                        <option value="center 50%">{L('المنتصف (50%)', 'Merkez (50%)', 'Center (50%)')}</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Membership details in THIS section */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {L('بيانات العضوية والمنصب في هذه الهيئة', 'Bu Heyetteki Görev ve Üyelik Bilgileri', 'Role & Membership in this Body')}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Role Title / Position */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {L('المنصب / الصفة في الهيئة', 'Heyetteki Görevi / Pozisyon', 'Role / Position')} ({formLocale.toUpperCase()}) *
                    </label>
                    <input
                      type="text"
                      required={formLocale === 'ar'}
                      value={memberForm.roleTitle[formLocale]}
                      onChange={(e) =>
                        setMemberForm({
                          ...memberForm,
                          roleTitle: { ...memberForm.roleTitle, [formLocale]: e.target.value },
                        })
                      }
                      placeholder={
                        formLocale === 'ar'
                          ? 'مثال: رئيس الهيئة، عضو مجلس، مسؤول البرامج'
                          : formLocale === 'tr'
                          ? 'Örn: Başkan, Üye, Genel Müdür'
                          : 'e.g. Chairperson, Member, Director'
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  {/* Level Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {L('المستوى الإداري', 'Hiyerarşik Kademe', 'Hierarchy Level')} *
                    </label>
                    <select
                      value={memberForm.level}
                      onChange={(e) =>
                        setMemberForm({
                          ...memberForm,
                          level: Number(e.target.value) as 1 | 2 | 3,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-primary-500 focus:outline-none"
                    >
                      <option value={1}>{L('المستوى الأول (الرئيس / القيادة العليا)', '1. Kademe (Başkan / Üst Yönetim)', 'Level 1: President / Chairperson')}</option>
                      <option value={2}>{L('المستوى الثاني (المدير التنفيذي / النائب)', '2. Kademe (Genel Müdür / İcra)', 'Level 2: Executive Director / Deputy')}</option>
                      <option value={3}>{L('المستوى الثالث (أعضاء / مسؤولو الإدارات)', '3. Kademe (Birim Yöneticileri / Üyeler)', 'Level 3: Department Managers & Members')}</option>
                    </select>
                  </div>
                </div>

                {/* Optional Hierarchy Parent */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {L('المسؤول المباشر في التسلسل (اختياري)', 'Bağlı Olduğu Yönetici (İsteğe Bağlı)', 'Reporting Supervisor (Hierarchy)')}
                  </label>
                  <select
                    value={memberForm.parentId || ''}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        parentId: e.target.value || null,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  >
                    <option value="">{L('-- بدون مسؤول مباشر (على رأس الهيكل) --', '-- Yönetici Yok (En Üst Kademe) --', '-- No supervisor (top level) --')}</option>
                    {memberships
                      .filter(
                        (m) =>
                          m.section_id === memberForm.sectionId &&
                          m.id !== memberForm.membershipId,
                      )
                      .map((m) => {
                        const p = peopleMap.get(m.person_id);
                        return (
                          <option key={m.id} value={m.id}>
                            {p?.name?.[locale] || p?.slug} ({m.role_title?.[locale] || `Lvl ${m.level}`})
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>

              {/* Bios - only when NOT existing person mode */}
              {!isExistingPersonMode && (
                <>
                  {/* Short Bio */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {L('نبذة مختصرة عن المهمة والمسؤولية', 'Kısa Görev Tanımı', 'Short Role Description')} ({formLocale.toUpperCase()})
                    </label>
                    <textarea
                      rows={2}
                      value={memberForm.shortBio[formLocale]}
                      onChange={(e) =>
                        setMemberForm({
                          ...memberForm,
                          shortBio: { ...memberForm.shortBio, [formLocale]: e.target.value },
                        })
                      }
                      placeholder={
                        formLocale === 'ar'
                          ? 'مقدمة تعريفية مختصرة تظهر في عرض الملف التعريفي للعضو...'
                          : formLocale === 'tr'
                          ? 'Üye profil vitrininde ilk paragraf olarak görünür...'
                          : 'Lead summary paragraph shown in the member showcase...'
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  {/* Full Biography */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {L('السيرة التعريفية الكاملة', 'Tam Biyografi', 'Full Biography')} ({formLocale.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      value={memberForm.fullBio[formLocale]}
                      onChange={(e) =>
                        setMemberForm({
                          ...memberForm,
                          fullBio: { ...memberForm.fullBio, [formLocale]: e.target.value },
                        })
                      }
                      placeholder={
                        formLocale === 'ar'
                          ? 'السيرة التفصيلية والخبرات التي تظهر في ملف العضو المختار...'
                          : formLocale === 'tr'
                          ? 'Seçilen üyenin detaylı biyografi metni...'
                          : 'Detailed biography text displayed in the featured member profile...'
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Publication toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="member_published"
                  checked={memberForm.isPublished}
                  onChange={(e) => setMemberForm({ ...memberForm, isPublished: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="member_published" className="text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                  {L('نشر هذا العضو على الموقع العام', 'Bu üyeyi sitede yayınla', 'Publish this member on the public site')}
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {L('إلغاء', 'İptal', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-primary-700 transition"
                >
                  {L('حفظ العضو', 'Üyeyi Kaydet', 'Save Member')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MOVE MEMBER TO ANOTHER SECTION MODAL
         ========================================================================= */}
      {moveModalOpen && membershipToMove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg mb-2">
              {L('نقل العضو إلى هيئة أخرى', 'Üyeyi Başka Heyete Taşı', 'Move Member to Another Section')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">
              {L(
                `اختر الهيئة التي ترغب في نقل "${peopleMap.get(membershipToMove.person_id)?.name?.[locale] || 'العضو'}" إليها:`,
                `Bu üyeyi taşımak istediğiniz heyeti seçin:`,
                `Select the section you want to move this member to:`,
              )}
            </p>

            <div className="space-y-2 mb-5">
              {sections.map((sec) => (
                <label
                  key={sec.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    targetSectionId === sec.id
                      ? 'border-primary-600 bg-primary-50 text-primary-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="target_section"
                      value={sec.id}
                      checked={targetSectionId === sec.id}
                      onChange={() => setTargetSectionId(sec.id)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">{sec.title?.[locale] || sec.slug}</span>
                  </div>
                  {membershipToMove.section_id === sec.id && (
                    <span className="text-[11px] text-slate-400 font-normal">
                      ({L('الهيئة الحالية', 'Mevcut', 'Current')})
                    </span>
                  )}
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setMoveModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                {L('إلغاء', 'İptal', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmMoveMember}
                className="rounded-xl bg-primary-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-primary-700 transition"
              >
                {L('تأكيد النقل', 'Taşımayı Onayla', 'Confirm Move')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <MediaPicker
          accept="image"
          onSelect={(url) => {
            setMemberForm({ ...memberForm, image: url });
            setMediaPickerOpen(false);
          }}
          onClose={() => setMediaPickerOpen(false)}
        />
      )}
    </div>
  );
}

