import { ArrowUpRight } from "lucide-react";
import type { DeliveryLinks as DeliveryLinksData, ShoppingLink } from "@/config/affiliates";

function StoreList({ links, label }: { links: ShoppingLink[]; label: string }) {
  return (
    <nav className="delivery-list" aria-label={label}>
      {links.map((link) => (
        <a className={`shopping-retailer marketplace-${link.id}`} href={link.href} key={link.id} rel="sponsored noopener noreferrer" target="_blank">
          <span>{link.label}</span><ArrowUpRight aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}

export function DeliveryLinks({ links, eventName }: { links: DeliveryLinksData; eventName: string }) {
  return (
    <div className="delivery-links">
      <h4>Need it today? ⚡</h4>
      <p>Delivered in minutes.</p>
      <StoreList links={links.quick} label={`Quick delivery for ${eventName}`} />
      <h4>Order the party food 🍕</h4>
      <StoreList links={links.food} label="Food delivery" />
    </div>
  );
}
