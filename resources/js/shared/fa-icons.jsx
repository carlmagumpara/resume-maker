import * as Icons from 'react-icons/fa6';

const slugToTitlecase = (slug) => slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

const CustomFaIcon = ({ name }) => {
  const FaIcon = Icons[slugToTitlecase(name)];

  if (!FaIcon) return <p>Icon not found!</p>;

  return <FaIcon />;
};

export default CustomFaIcon;