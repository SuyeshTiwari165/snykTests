export interface IProps {
  exact?: boolean;
  path: string;
  component: React.ComponentType<any>;
  location?: {
    state?: Object;
  };
}
