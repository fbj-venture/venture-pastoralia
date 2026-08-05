const RECENT_VISITS = [
    {id: 1, name: 'Patricia Okafor', type: 'Home', date: 'Yesterday', notes: 'Health concerns, prayed together'},
    {id: 2, name: 'Thomas & Linda Grant', type: 'Hospital', date: 'Mon', notes: 'Pre-surgery prayer, family present'},
    {id: 3, name: 'Youth Group', type: 'Group', date: 'Sun', notes: 'Post-service check-ins, 8 members'},
    {id: 4, name: 'Carl Benedetti', type: 'Counseling', date: 'Sat', notes: 'Marriage counseling, 2nd session'},
]

export function RecentVisitsPanel() {
    return (
        <section class="panel">
            <div class="panel__header">
                <h2 class="panel__title">Recent Visits</h2>
                <a href="#" class="panel__link">View all</a>
            </div>
            <ul class="list">
                {RECENT_VISITS.map(v => (
                    <li key={v.id} class="list__item">
                        <div class="list__main">
                            <div class="list__name-row">
                                <span class="list__name">{v.name}</span>
                                <span class="list__badge">{v.type}</span>
                            </div>
                            <span class="list__sub">{v.notes}</span>
                        </div>
                        <div class="list__meta">
                            <span class="list__due">{v.date}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}