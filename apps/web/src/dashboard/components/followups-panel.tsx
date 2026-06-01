const FOLLOW_UPS = [
    {id: 1, name: 'Margaret Chen', reason: 'Hospital follow-up', due: 'Today', urgent: true},
    {id: 2, name: 'Robert Whitfield', reason: 'Grief support check-in', due: 'Today', urgent: true},
    {id: 3, name: 'The Morrison Family', reason: 'New member welcome', due: 'Thu', urgent: false},
    {id: 4, name: 'James Alcott', reason: 'Counseling follow-up', due: 'Fri', urgent: false},
    {id: 5, name: 'Eleanor Voss', reason: 'Bereavement support', due: 'Mon', urgent: false},
]

export function FollowUpsPanel() {
    return (
        <section class="panel">
            <div class="panel__header">
                <h2 class="panel__title">Upcoming Follow-ups</h2>
                <a href="#" class="panel__link">View all</a>
            </div>
            <ul class="list">
                {FOLLOW_UPS.map(fu => (
                    <li key={fu.id} class={`list__item${fu.urgent ? ' list__item--urgent' : ''}`}>
                        <div class="list__main">
                            <span class="list__name">{fu.name}</span>
                            <span class="list__sub">{fu.reason}</span>
                        </div>
                        <div class="list__meta">
                            <span class={`list__due${fu.urgent ? ' list__due--urgent' : ''}`}>{fu.due}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}
