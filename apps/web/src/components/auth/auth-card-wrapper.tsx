import {
  Card,
  CardContent,
  //   CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Link } from '@tanstack/react-router'

type AuthCardWrapperProps = {
  children: React.ReactNode
  headerLabel: string
  //   redirectLabel: string
  //   redirecrPath: string
  //   showProvider?: boolean
}

export const AuthCardWrapper = ({
  children,
  headerLabel,
  //   redirectLabel,
  //   redirecrPath,
  //   showProvider = true,
}: AuthCardWrapperProps) => {
  return (
    <Card className="w-[500px] ">
      <CardHeader>
        <CardTitle className="text-center">{headerLabel}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-center">
        {/* <Button variant="link" asChild>
          <Link to={redirecrPath}>{redirectLabel}</Link>
        </Button> */}
      </CardFooter>
    </Card>
  )
}
