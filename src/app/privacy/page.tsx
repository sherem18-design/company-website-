import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Е-Спасатель",
  icons: { icon: "/emblema.png" },
};

const UPDATED = "01 января 2026 г.";
const OPERATOR = 'ООО «Е-Спасатель»';
const INN = "7700000000";
const ADDRESS = "г. Москва, ул. Примерная, д. 1, офис 100";
const EMAIL = "privacy@e-saver.ru";
const PHONE = "+7 (800) 000-00-00";

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-4 mt-10 flex items-center gap-3">
      <div className="h-px w-4 flex-shrink-0" style={{ background: "var(--accent)" }} />
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>{children}</p>;
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>
      <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--accent)" }} />
      <span>{children}</span>
    </li>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(rgba(0,232,124,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,124,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 sticky top-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,6,8,0.92)", backdropFilter: "blur(12px)" }}>
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          <div className="flex items-center justify-center w-8 h-8" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </div>
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase hidden sm:block" style={{ color: "rgba(255,255,255,0.3)" }}>Назад</span>
        </Link>
        <div className="flex items-center gap-3">
          <Image src="/emblema.png" alt="Е-Спасатель" width={28} height={28} style={{ opacity: 0.8 }} />
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--accent)" }}>Е-Спасатель</span>
        </div>
        <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>152-ФЗ</div>
      </header>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-12 pb-24">
        {/* Title */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="h-px w-6" style={{ background: "var(--accent)" }} />
            <span className="hud-label text-[9px]">ПРАВОВОЙ ДОКУМЕНТ</span>
          </div>
          <h1 className="hud-title text-3xl sm:text-4xl text-white mb-3">Политика<br /><span style={{ color: "var(--accent)" }}>конфиденциальности</span></h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Редакция от {UPDATED} · В соответствии с Федеральным законом №152-ФЗ «О персональных данных»</p>
        </div>

        <div className="p-4 mb-8 flex gap-3 items-start" style={{ background: "rgba(0,232,124,0.04)", border: "1px solid rgba(0,232,124,0.2)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            Настоящая Политика конфиденциальности определяет порядок сбора, хранения, использования и защиты персональных данных пользователей веб-сайта e-saver.ru, осуществляемых {OPERATOR} (далее — Оператор).
          </p>
        </div>

        {/* 1 */}
        <H2>1. Оператор персональных данных</H2>
        <P>{OPERATOR}, ИНН: {INN}</P>
        <P>Юридический адрес: {ADDRESS}</P>
        <P>Электронная почта: <span style={{ color: "var(--accent)" }}>{EMAIL}</span></P>
        <P>Телефон: {PHONE}</P>

        {/* 2 */}
        <H2>2. Перечень собираемых персональных данных</H2>
        <P>Оператор обрабатывает следующие категории персональных данных:</P>
        <ul className="mb-4 ml-2">
          <Li>Фамилия, имя, отчество пользователя</Li>
          <Li>Дата рождения</Li>
          <Li>Паспортные данные (серия, номер) — только при оформлении страховых продуктов</Li>
          <Li>Адрес регистрации / проживания</Li>
          <Li>Номер телефона и адрес электронной почты</Li>
          <Li>Данные транспортного средства (марка, модель, VIN, государственный регистрационный знак)</Li>
          <Li>Сведения о полисе ОСАГО</Li>
          <Li>Данные местонахождения (при заявке на эвакуацию)</Li>
          <Li>Технические данные: IP-адрес, тип браузера, файлы cookie</Li>
        </ul>

        {/* 3 */}
        <H2>3. Цели обработки персональных данных</H2>
        <P>Персональные данные обрабатываются в следующих целях:</P>
        <ul className="mb-4 ml-2">
          <Li>Предоставление услуг по оформлению ОСАГО, европротокола и вызова эвакуатора</Li>
          <Li>Идентификация пользователя при обращении за услугами</Li>
          <Li>Связь с пользователем (звонки, SMS, email) для исполнения договора</Li>
          <Li>Передача данных страховым компаниям и партнёрским организациям для оформления полиса</Li>
          <Li>Соблюдение требований законодательства Российской Федерации</Li>
          <Li>Улучшение качества работы сервиса и разработка новых функций</Li>
          <Li>Направление информационных сообщений с согласия пользователя</Li>
        </ul>

        {/* 4 */}
        <H2>4. Правовые основания обработки</H2>
        <ul className="mb-4 ml-2">
          <Li>Согласие субъекта персональных данных (ст. 6, п. 1.1 Закона №152-ФЗ)</Li>
          <Li>Исполнение договора, стороной которого является субъект персональных данных (ст. 6, п. 1.5)</Li>
          <Li>Выполнение обязательств, предусмотренных законодательством РФ (ст. 6, п. 1.2)</Li>
          <Li>Защита жизни, здоровья или иных жизненно важных интересов (ст. 6, п. 1.6)</Li>
        </ul>

        {/* 5 */}
        <H2>5. Хранение и защита данных</H2>
        <P>Персональные данные хранятся на серверах, расположенных на территории Российской Федерации, в соответствии со ст. 18.1 Федерального закона №152-ФЗ.</P>
        <P>Оператор применяет организационные и технические меры защиты: шифрование данных (TLS/SSL), ограничение доступа по принципу минимальных привилегий, регулярное резервное копирование.</P>
        <P>Срок хранения персональных данных — в течение срока предоставления услуг и 3 лет после его окончания, если иное не предусмотрено законодательством.</P>

        {/* 6 */}
        <H2>6. Передача персональных данных третьим лицам</H2>
        <P>Оператор может передавать персональные данные следующим категориям получателей:</P>
        <ul className="mb-4 ml-2">
          <Li>Страховые компании — партнёры Оператора (для оформления полисов ОСАГО)</Li>
          <Li>Эвакуаторные службы — партнёры Оператора (для организации эвакуации)</Li>
          <Li>Государственные органы — по законным запросам (МВД, суды, прокуратура)</Li>
        </ul>
        <P>Передача данных третьим лицам в коммерческих целях без согласия пользователя не осуществляется.</P>

        {/* 7 */}
        <H2>7. Права субъектов персональных данных</H2>
        <P>В соответствии с Федеральным законом №152-ФЗ пользователь вправе:</P>
        <ul className="mb-4 ml-2">
          <Li>Получить информацию об обрабатываемых персональных данных</Li>
          <Li>Потребовать уточнения, блокирования или уничтожения данных</Li>
          <Li>Отозвать согласие на обработку персональных данных в любой момент</Li>
          <Li>Обжаловать действия Оператора в Роскомнадзор (rkn.gov.ru)</Li>
        </ul>
        <P>Для реализации прав направьте обращение на электронную почту: <span style={{ color: "var(--accent)" }}>{EMAIL}</span></P>

        {/* 8 */}
        <H2>8. Использование файлов Cookie</H2>
        <P>Сайт использует файлы cookie для обеспечения корректной работы и анализа посещаемости. Подробная информация — в{" "}
          <Link href="/cookies" style={{ color: "var(--accent)" }}>Политике использования cookie</Link>.
        </P>
        <P>Пользователь вправе отключить файлы cookie в настройках браузера, однако это может повлиять на функциональность сайта.</P>

        {/* 9 */}
        <H2>9. Дети</H2>
        <P>Сервис не предназначен для лиц, не достигших 18 лет. Оператор не собирает намеренно персональные данные несовершеннолетних.</P>

        {/* 10 */}
        <H2>10. Изменения политики</H2>
        <P>Оператор вправе вносить изменения в настоящую Политику. Актуальная редакция размещается на данной странице. Продолжение использования сайта после публикации изменений означает согласие с обновлённой Политикой.</P>

        {/* Contact */}
        <div className="mt-12 p-5" style={{ border: "1px solid rgba(0,232,124,0.2)", background: "rgba(0,232,124,0.03)" }}>
          <div className="text-[9px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "var(--accent)" }}>Контакты по вопросам обработки данных</div>
          <p className="text-sm text-white mb-1">{OPERATOR}</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{ADDRESS}</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Email: <span style={{ color: "var(--accent)" }}>{EMAIL}</span></p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Тел.: {PHONE}</p>
        </div>

        <div className="mt-8 flex gap-4 flex-wrap">
          <Link href="/cookies" className="btn-neon px-6 py-3 text-xs font-bold tracking-widest uppercase" style={{ display: "inline-flex", alignItems: "center" }}>
            Политика Cookie
          </Link>
          <Link href="/" className="btn-neon px-6 py-3 text-xs font-bold tracking-widest uppercase" style={{ display: "inline-flex", alignItems: "center" }}>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
