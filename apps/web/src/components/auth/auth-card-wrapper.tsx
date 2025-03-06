import {
  Card,
  CardContent,
  //   CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

type AuthCardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  redirectLabel: string;
  redirectPath: string;
  showProvider?: boolean;
};

export const AuthCardWrapper = ({
  children,
  headerLabel,
  redirectLabel,
  redirectPath,
  showProvider = true,
}: AuthCardWrapperProps) => {
  return (
    <Card className="w-[500px] bg-background text-foreground">
      <CardHeader>
        <CardTitle className="text-center">{headerLabel}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showProvider && <AuthProviders />}
      <CardFooter className="justify-center">
        <Button variant="link" asChild>
          <Link to={redirectPath}>{redirectLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const AuthProviders = () => {
  return (
    <CardFooter className="flex gap-x-2">
      <Button variant="secondary" size="lg" className="w-full" disabled>
        <FcGoogle className="h-6 w-6 mr-2" />
        Google
      </Button>
      <Button variant="secondary" size="lg" className="w-full" disabled>
        <FaGithub className="h-6 w-6 mr-2" />
        Github
      </Button>
    </CardFooter>
  );
};
