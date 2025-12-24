import { ShadowIcon } from "@radix-ui/react-icons";

export const LoadingWrapper = () => {
  return (
    <div className="flex justify-center items-center h-24">
      <ShadowIcon className="animate-spin size-12 text-primary" />
    </div>
  );
};
