export enum WorkorderStatus {
  PENDING = 1,
  REVISION = 3,
  CHECKING = 5,
  IN_PROGRESS = 7,
  DELAYED = 8,
}

export type Action = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'warning' | 'danger';
  size?: 'sm';
};
