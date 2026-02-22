import React from 'react';
import { FaGithub } from 'react-icons/fa';

const GITHUB_HREF = 'https://github.com/getdiby/openset';

export default function GitHubNavbarItem(): React.ReactElement {
  return (
    <a
      href={GITHUB_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="navbar__link navbar__link--icon"
      aria-label="OpenSet on GitHub"
    >
      <FaGithub size={20} aria-hidden />
    </a>
  );
}
