/**
 * Card - Content card component
 *
 * Card with optional image, title, and description.
 */

import { clsx } from 'clsx';
import {
  card,
  cardHoverable,
  cardImage,
  cardContent,
  cardTitle,
  cardDescription,
} from '../../styles/site';
import type { CardProps } from './types';

export function Card({
  id,
  className,
  title,
  description,
  image,
  href,
  hoverable = true,
}: CardProps) {
  const content = (
    <>
      {image && (
        <img
          src={image}
          alt={title}
          className={cardImage}
        />
      )}
      <div className={cardContent}>
        <h3 className={cardTitle}>{title}</h3>
        {description && (
          <p className={cardDescription}>{description}</p>
        )}
      </div>
    </>
  );

  const classes = clsx(
    card,
    hoverable && cardHoverable,
    className
  );

  if (href) {
    return (
      <a id={id} href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <div id={id} className={classes}>
      {content}
    </div>
  );
}
