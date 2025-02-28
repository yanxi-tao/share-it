import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  // CardTitle,
} from "@/components/ui/card";

export const FeedCard = ({
  id,
  title,
  description,
  url,
  imageUrl,
}: {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}) => {
  return (
    <a href={url}>
      <Card className="w-[350px]" id={id}>
        <CardHeader>
          {imageUrl ? (
            <img src={imageUrl} className="h-full object-cover w-full" />
          ) : (
            <div className="h-[200px] bg-gray-200" />
          )}
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <span className="bold text-lg text-center">{title}</span>
            {/* <span>{description}</span> */}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </a>
  );
};
