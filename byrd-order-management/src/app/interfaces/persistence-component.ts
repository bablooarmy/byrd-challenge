export interface IPersistenceComponent {
    persistDataAfterRefresh: () => void;
    persistDataBeforeRefresh: () => void;
}