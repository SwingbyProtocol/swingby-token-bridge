import { Item, ItemIcon } from './styled';

export const OptionItem = ({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon?: React.ReactNode;
  label: React.ReactNode;
}) => {
  return (
    <Item
      onClick={(evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        onClick();
      }}
    >
      {!!icon && (
        <>
          <ItemIcon>{icon}</ItemIcon>
          &nbsp;
        </>
      )}
      {label}
    </Item>
  );
};
