export type MainMenuProps = {
    selectZenMode: () => void,
    selectTimeAttack: () => void,
}

export default function MainMenu(props: MainMenuProps) {
    const {
        selectZenMode,
        selectTimeAttack
    } = props;

    return (
        <div className="main-menu">
            <div className="main-menu-button" onClick={selectZenMode}>Play Creative Mode</div>
            <div className="main-menu-button" onClick={selectTimeAttack}>Play Time Attack</div>
        </div>
    )
}