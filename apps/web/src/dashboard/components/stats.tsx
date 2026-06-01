
export function Stats() {
    return (
        <div class="stats">
            <div class="stat">
                <span class="stat__value">7</span>
                <span class="stat__label">Visits this week</span>
                <span class="stat__trend stat__trend--positive">↑ 2 from last week</span>
            </div>
            <div class="stat stat--alert">
                <span class="stat__value">12</span>
                <span class="stat__label">Follow-ups pending</span>
                <span class="stat__trend stat__trend--warn">3 due today</span>
            </div>
            <div class="stat">
                <span class="stat__value">148</span>
                <span class="stat__label">Active members</span>
            </div>
            <div class="stat">
                <span class="stat__value">4</span>
                <span class="stat__label">New this month</span>
                <span class="stat__trend stat__trend--positive">↑ Welcome them</span>
            </div>
        </div>
    )
}
