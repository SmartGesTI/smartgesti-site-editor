/**
 * Content Renderers
 * Auto-registra todos os renderizadores de conteúdo
 */

import { renderRegistry } from "../../registry/renderRegistry";
import { renderHeading } from "./HeadingRenderer";
import { renderText } from "./TextRenderer";
import { renderImage } from "./ImageRenderer";
import { renderButton } from "./ButtonRenderer";
import { renderLink } from "./LinkRenderer";
import { renderDivider } from "./DividerRenderer";
import { renderBadge } from "./BadgeRenderer";
import { renderIcon } from "./IconRenderer";
import { renderAvatar } from "./AvatarRenderer";
import { renderVideo } from "./VideoRenderer";
import { renderSocialLinks } from "./SocialLinksRenderer";

// Registrar renderizadores
renderRegistry.register("heading", renderHeading);
renderRegistry.register("text", renderText);
renderRegistry.register("image", renderImage);
renderRegistry.register("button", renderButton);
renderRegistry.register("link", renderLink);
renderRegistry.register("divider", renderDivider);
renderRegistry.register("badge", renderBadge);
renderRegistry.register("icon", renderIcon);
renderRegistry.register("avatar", renderAvatar);
renderRegistry.register("video", renderVideo);
renderRegistry.register("socialLinks", renderSocialLinks);
