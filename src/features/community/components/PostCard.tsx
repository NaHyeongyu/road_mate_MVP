import { useMemo, useState, type ReactNode } from "react";
import { Text, View } from "react-native";

import type { RoutePost } from "../../../model";
import type { AppStyles } from "../../../ui/types";
import { RoutePostDetailModal } from "./RoutePostDetailModal";
import { PostCardActions } from "./postCard/PostCardActions";
import { PostCardHeader } from "./postCard/PostCardHeader";
import { PostCardRouteStack } from "./postCard/PostCardRouteStack";

type PostCardProps = {
  post: RoutePost;
  styles: AppStyles;
  isOwnedByCurrentUser?: boolean;
  isSaved?: boolean;
  viewDetailsLabel?: string;
  disableDetailModal?: boolean;
  onViewDetails?: () => void;
  extraContent?: ReactNode;
  onToggleSave?: () => void;
  onDelete?: () => void;
};

export function PostCard({
  post,
  styles,
  isOwnedByCurrentUser = false,
  isSaved = false,
  viewDetailsLabel,
  disableDetailModal = false,
  onViewDetails,
  extraContent,
  onToggleSave,
  onDelete,
}: PostCardProps) {
  const isRegular = post.kind === "regular";
  const seatsLabel = isRegular ? `${post.availableSeats} seats left` : undefined;
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const operatingDaysSummary = useMemo(() => {
    if (!post.operatingDays.length) {
      return "Operating day info not set";
    }
    return post.operatingDays.join(" · ");
  }, [post.operatingDays]);
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
      return;
    }

    if (!disableDetailModal) {
      setIsDetailOpen(true);
    }
  };
  const shouldRenderViewDetailsAction = Boolean(onViewDetails || !disableDetailModal);

  return (
    <>
      <View style={styles.postCard}>
        <PostCardHeader post={post} styles={styles} isRegular={isRegular} seatsLabel={seatsLabel} />
        <PostCardRouteStack post={post} styles={styles} isRegular={isRegular} />

        <View style={styles.postSummaryRow}>
          <Text numberOfLines={1} style={styles.postSummaryText}>
            {isRegular ? `Runs ${operatingDaysSummary}` : "One-time notice"}
          </Text>
        </View>

        {extraContent}

        <PostCardActions
          styles={styles}
          isSaved={isSaved}
          viewDetailsLabel={viewDetailsLabel}
          onViewDetails={shouldRenderViewDetailsAction ? handleViewDetails : undefined}
          onDelete={onDelete}
          onToggleSave={onToggleSave}
        />
      </View>

      {!disableDetailModal ? (
        <RoutePostDetailModal
          visible={isDetailOpen}
          post={post}
          styles={styles}
          isOwnedByCurrentUser={isOwnedByCurrentUser}
          isSaved={isSaved}
          onDelete={onDelete}
          onToggleSave={onToggleSave}
          onClose={() => setIsDetailOpen(false)}
        />
      ) : null}
    </>
  );
}
