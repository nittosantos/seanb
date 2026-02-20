'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  IdentificationIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import PaymentPayoutsBlock from '@/components/settings/payment-payouts/payment-payouts-block';
import LoginSecurity from '@/components/settings/login-security/login-security-block';
import PersonalInfoForm from '@/components/settings/form/personal-info-form';
import { TabItem, Tablist, TabPanel, TabPanels } from '@/components/ui/tab';
import Notifications from '@/components/settings/notifications';
import SelectBox from '@/components/ui/select-box';

export default function AccountSettingsPage() {
  const t = useTranslations('settings');
  const [selected, setSelected] = useState(0);

  const tabData = [
    {
      label: t('tabPersonalInfo'),
      path: 0,
      icon: <IdentificationIcon className="h-auto w-5" />,
    },
    {
      label: t('tabLoginSecurity'),
      path: 1,
      icon: <ShieldCheckIcon className="h-auto w-5" />,
    },
    {
      label: t('tabPaymentsPayouts'),
      path: 2,
      icon: <CreditCardIcon className="h-auto w-5" />,
    },
    {
      label: t('tabNotifications'),
      path: 3,
      icon: <BellIcon className="h-auto w-5" />,
    },
  ];

  return (
    <div className="container-fluid mt-5 grid !max-w-[1280px] grid-cols-1 gap-5 pb-10 md:mt-7 lg:grid-cols-[260px_1fr] xl:mt-12 xl:gap-8 2xl:gap-12 3xl:mt-16 3xl:!px-0">
      <SelectBox
        value={tabData[selected]}
        className="lg:hidden"
        options={tabData}
        optionIcon={true}
        onChange={(data: (typeof tabData)[number]) => setSelected(data.path)}
        buttonClassName="h-12 font-bold"
      />
      <Tab.Group
        selectedIndex={selected}
        onChange={setSelected}
        as="div"
        className="contents"
      >
        <Tablist className="hidden shrink-0 lg:block lg:w-[260px] lg:rounded-xl lg:border lg:border-gray-lighter lg:bg-gray-lightest lg:p-1">
          {tabData?.map((item) => (
            <TabItem
              key={item.path}
              className="w-full py-3 px-4 lg:rounded-lg lg:px-5"
              motionLayoutId="settingTab"
              motionClassName="!h-full !top-0 !bg-gray-dark !w-1 !rounded-lg !-z-10"
            >
              <span className="flex items-center gap-4 text-gray-dark">
                {item.icon}
                {item.label}
              </span>
            </TabItem>
          ))}
        </Tablist>
        <TabPanels className="min-w-0">
          <TabPanel>
            <PersonalInfoForm />
          </TabPanel>
          <TabPanel>
            <LoginSecurity />
          </TabPanel>
          <TabPanel>
            <PaymentPayoutsBlock />
          </TabPanel>
          <TabPanel>
            <Notifications />
          </TabPanel>
        </TabPanels>
      </Tab.Group>
    </div>
  );
}
