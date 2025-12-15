import { ProviderWrapper } from "@/context";
import AppLayout from "./AppLayout";
import "./globals.css";

interface Props {
  children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning className="toc-sidebar light">
      <body>
        <ProviderWrapper>
          <AppLayout>{children}</AppLayout>
        </ProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
