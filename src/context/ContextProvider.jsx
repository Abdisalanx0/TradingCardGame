import { AuthProvider } from "./AuthContext";
import { EventsProvider } from "./EventsContext";
import { MessageProvider } from "./MessageContext";
import { CardProvider } from "./CardContext";
import { HeaderProvider } from "./HeaderContext";
import { MarketplaceProvider } from "./MarketplaceContext";
import { InventoryProvider } from "./InventoryContext";
import { CheckoutProvider } from "./CheckoutContext";

const ContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <EventsProvider>
        <MessageProvider>
          <CardProvider>
            <HeaderProvider>
              <MarketplaceProvider>
                <InventoryProvider>
                  <CheckoutProvider>{children}</CheckoutProvider>
                </InventoryProvider>
              </MarketplaceProvider>
            </HeaderProvider>
          </CardProvider>
        </MessageProvider>
      </EventsProvider>
    </AuthProvider>
  );
};

export default ContextProvider;
