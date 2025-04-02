import {Link} from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

  export default function Navbar() {
    const t = useTranslations("nav")
    return (
      <div className="navbar bg-base-100 px-6">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl flex items-center gap-2">
            Flymorocco
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link href="/site-guides">{t('siteGuides')}</Link></li>
            <li><Link href="/admin-info">{t('adminInfo')}</Link></li>
            <li><Link href="/tours">{t('tours')}</Link></li>
            <li><Link href="/about">{t('about')}</Link></li>
          </ul>
        </div>
      </div>
    )
  }

