import { PlatformCard } from "@/components/integrations/platform-card";

export default function IntegrationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Integrations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlatformCard
          name="Shopee"
          description="Sync orders and products from your Shopee store automatically."
          isConnected={false}
        />
        <PlatformCard
          name="Lazada"
          description="Sync orders and products from your Lazada store automatically."
          isConnected={false}
        />
      </div>
    </div>
  );
}
