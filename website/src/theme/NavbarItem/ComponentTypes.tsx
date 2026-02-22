import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import GitHubNavbarItem from '@site/src/components/NavbarItems/GitHubNavbarItem';

export default {
  ...ComponentTypes,
  'custom-githubIcon': GitHubNavbarItem,
  // typo alias so both spellings work
  'custom-githublcon': GitHubNavbarItem,
};
