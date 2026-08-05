import {IconHamburger, IconPlus} from "../../components/icons";

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
    const date = new Date().toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

    return (
        <header class="header">
            <div class="header__left">
                <button class="header__hamburger" onClick={onMenuToggle} aria-label="Toggle menu">
                    <IconHamburger />
                </button>
                <div>
                    <h1 class="header__title">{greeting}, Pastor Francis</h1>
                    <p class="header__date">{date}</p>
                </div>
            </div>
            <button class="btn btn--primary">
                <IconPlus />
                <span class="btn__label">Log a visit</span>
            </button>
        </header>
    )
}
