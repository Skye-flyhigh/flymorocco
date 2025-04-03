import {Link} from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

  export default function Navbar() {
    const t = useTranslations("nav")
    return (
      <div className="navbar">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl flex items-center gap-2">
            <Image src="/images/FMorocco-logo-single-transparent-color.svg" alt='Flymorocco Logo' width={30} height={30} priority></Image>
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link className="link link-hover" href="/site-guides">{t('siteGuides')}</Link></li>
            <li><Link className="link link-hover" href="/admin-info">{t('adminInfo')}</Link></li>
            <li><Link className="link link-hover" href="/tours">{t('tours')}</Link></li>
            <li><Link className="link link-hover" href="/about">{t('about')}</Link></li>
          </ul>
        </div>
      </div>
    )
  }

