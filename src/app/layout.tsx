import { ProviderWrapper } from "@/context";
import AppLayout from "./AppLayout";
import "./globals.css";

interface Props {
  children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning className="light bg-background">
      <body className="overflow-hidden">
        <ProviderWrapper>
          <AppLayout>{children}</AppLayout>
        </ProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;