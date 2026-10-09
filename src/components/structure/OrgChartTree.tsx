import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { AdministrativeMember } from '@/data/about';
import OrgChartCard from './OrgChartCard';
import MemberProfileModal from './MemberProfileModal';
import { useI18n } from '@/i18n/useI18n';
import { ChevronDown, Users } from 'lucide-react';

type OrgChartTreeProps = {
  members: AdministrativeMember[];
};

export default function OrgChartTree({ members }: OrgChartTreeProps) {
  const { locale, isRtl } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const [selectedMember, setSelectedMember] = useState<AdministrativeMember | null>(null);

  // Filter published members sorted by order
  const published = members
    .filter((m) => m.published !== false)
    .sort((a, b) => a.order - b.order);

  const president = published.find((m) => m.level === 1);
  const executiveDirector = published.find((m) => m.level === 2);
  const departments = published.filter((m) => m.level === 3);

  // Animation settings
  const ease = [0.22, 1, 0.36, 1] as const;

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.5,
        delay: shouldReduceMotion ? 0 : customDelay,
        ease,
      },
    }),
  };

  const verticalLineVariants = {
    hidden: { scaleY: shouldReduceMotion ? 1 : 0, opacity: shouldReduceMotion ? 1 : 0 },
    visible: (customDelay: number) => ({
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.35,
        delay: shouldReduceMotion ? 0 : customDelay,
        ease,
      },
    }),
  };

  const horizontalLineVariants = {
    hidden: { scaleX: shouldReduceMotion ? 1 : 0, opacity: shouldReduceMotion ? 1 : 0 },
    visible: (customDelay: number) => ({
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.4,
        delay: shouldReduceMotion ? 0 : customDelay,
        ease,
      },
    }),
  };

  const departmentsLabel =
    locale === 'ar'
      ? 'الإدارات التنفيذية'
      : locale === 'tr'
      ? 'İcra Birimleri'
      : 'Executive Departments';

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* =========================================================================
          DESKTOP ORG CHART (3 Levels Hierarchical Tree with Connector Lines)
         ========================================================================= */}
      <div className="hidden lg:flex lg:flex-col lg:items-center">
        {/* LEVEL 1: PRESIDENT */}
        {president && (
          <motion.div
            custom={0.1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="z-10 flex justify-center w-full"
          >
            <OrgChartCard
              member={president}
              onSelect={setSelectedMember}
              className="hover:scale-[1.01]"
            />
          </motion.div>
        )}

        {/* CONNECTOR 1: PRESIDENT -> EXECUTIVE DIRECTOR */}
        <div className="relative flex flex-col items-center h-12 w-full justify-center">
          <motion.div
            custom={0.35}
            variants={verticalLineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ transformOrigin: 'top' }}
            className="w-[2px] h-full bg-slate-300"
          />
          {/* Subtle node dots */}
          <div className="absolute top-0 h-1.5 w-1.5 rounded-full bg-slate-400" />
          <div className="absolute bottom-0 h-1.5 w-1.5 rounded-full bg-primary-600" />
        </div>

        {/* LEVEL 2: EXECUTIVE DIRECTOR */}
        {executiveDirector && (
          <motion.div
            custom={0.55}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="z-10 flex justify-center w-full"
          >
            <OrgChartCard
              member={executiveDirector}
              onSelect={setSelectedMember}
              className="hover:scale-[1.01]"
            />
          </motion.div>
        )}

        {/* CONNECTOR 2: EXECUTIVE DIRECTOR -> 3 DEPARTMENTS */}
        {departments.length > 0 && (
          <div className="relative w-full max-w-6xl h-14">
            {/* Center stem down from Executive Director */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 h-7 w-[2px]">
              <motion.div
                custom={0.8}
                variants={verticalLineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{ transformOrigin: 'top' }}
                className="w-full h-full bg-slate-300"
              />
            </div>

            {/* Horizontal Branching Bar spanning from Column 1 center (16.666%) to Column 3 center (83.333%) */}
            <div className="absolute top-7 left-[16.666%] right-[16.666%] h-[2px]">
              <motion.div
                custom={0.95}
                variants={horizontalLineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{ transformOrigin: 'center' }}
                className="w-full h-full bg-slate-300"
              />
              {/* Branch center junction dot */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary-600 border border-white shadow-xs" />
            </div>

            {/* Three Drop Lines to each Department */}
            {/* Drop Line 1 (Column 1 Center: 16.666%) */}
            <div className="absolute left-[16.666%] -translate-x-1/2 top-7 h-7 w-[2px]">
              <motion.div
                custom={1.1}
                variants={verticalLineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{ transformOrigin: 'top' }}
                className="w-full h-full bg-slate-300"
              />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary-600 border border-white" />
            </div>

            {/* Drop Line 2 (Column 2 Center: 50%) */}
            <div className="absolute left-1/2 -translate-x-1/2 top-7 h-7 w-[2px]">
              <motion.div
                custom={1.1}
                variants={verticalLineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{ transformOrigin: 'top' }}
                className="w-full h-full bg-slate-300"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary-600 border border-white" />
            </div>

            {/* Drop Line 3 (Column 3 Center: 83.333%) */}
            <div className="absolute left-[83.333%] -translate-x-1/2 top-7 h-7 w-[2px]">
              <motion.div
                custom={1.1}
                variants={verticalLineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{ transformOrigin: 'top' }}
                className="w-full h-full bg-slate-300"
              />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary-600 border border-white" />
            </div>
          </div>
        )}

        {/* LEVEL 3: 3 DEPARTMENT MANAGERS */}
        {departments.length > 0 && (
          <div className="grid grid-cols-3 gap-6 w-full max-w-6xl">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.id}
                custom={1.25 + index * 0.15}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className="flex justify-center"
              >
                <OrgChartCard
                  member={dept}
                  onSelect={setSelectedMember}
                  className="w-full"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          MOBILE & TABLET ORG CHART (Clean Vertical Hierarchy with Connectors)
         ========================================================================= */}
      <div className="flex flex-col items-center lg:hidden space-y-4">
        {/* LEVEL 1: PRESIDENT */}
        {president && (
          <motion.div
            custom={0.1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full flex justify-center"
          >
            <OrgChartCard member={president} onSelect={setSelectedMember} />
          </motion.div>
        )}

        {/* Vertical connector line */}
        <div className="flex flex-col items-center h-8 justify-center">
          <div className="w-[2px] h-full bg-slate-300 relative">
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary-600" />
          </div>
        </div>

        {/* LEVEL 2: EXECUTIVE DIRECTOR */}
        {executiveDirector && (
          <motion.div
            custom={0.25}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full flex justify-center"
          >
            <OrgChartCard member={executiveDirector} onSelect={setSelectedMember} />
          </motion.div>
        )}

        {/* Vertical connector to departments */}
        {departments.length > 0 && (
          <>
            <div className="flex flex-col items-center h-8 justify-center">
              <div className="w-[2px] h-full bg-slate-300" />
            </div>

            {/* Department Level Indicator Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
              <Users className="h-3.5 w-3.5 text-primary-600" />
              <span>{departmentsLabel}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>

            {/* Departments vertically arranged with connecting lines */}
            <div className="w-full flex flex-col items-center space-y-4 mt-2">
              {departments.map((dept, index) => (
                <div key={dept.id} className="w-full flex flex-col items-center">
                  <motion.div
                    custom={0.35 + index * 0.12}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="w-full flex justify-center"
                  >
                    <OrgChartCard member={dept} onSelect={setSelectedMember} />
                  </motion.div>

                  {/* Connecting stem between cards except the last */}
                  {index < departments.length - 1 && (
                    <div className="flex flex-col items-center h-6 justify-center">
                      <div className="w-[2px] h-full bg-slate-300 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Member Profile Modal Dialog */}
      <MemberProfileModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}

