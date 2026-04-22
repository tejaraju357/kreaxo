import DashboardNavbar from './DashboardNavbar';

export default function DashboardLayout({ children, role }) {
    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <DashboardNavbar role={role} />

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px', display: 'flex', gap: '48px', width: '100%', flex: 1 }}>
                {/* Main Content Area */}
                <main style={{ flex: 1, minWidth: 0 }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
