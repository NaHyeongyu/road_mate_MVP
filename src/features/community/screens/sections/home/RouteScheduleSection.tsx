import type { OneTimeTripType, RouteDraft } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { View } from "react-native";

import { useAppCopy } from "../../../../../i18n/AppI18nContext";
import { Label } from "../../../../shared/components/Label";
import { ToggleChip } from "../../../../shared/components/ToggleChip";
import { RouteDateField } from "./RouteDateField";
import { RouteTimeField } from "./RouteTimeField";

type RouteScheduleSectionProps = {
  styles: AppStyles;
  routeDraft: RouteDraft;
  isOneTimeRoute: boolean;
  isOneTimeRoundTrip: boolean;
  onPressDepartureDate: () => void;
  onPressReturnDate: () => void;
  onChangeOneTimeTripType: (tripType: OneTimeTripType) => void;
  onPressScheduleTime: () => void;
  onPressReturnTime: () => void;
};

export function RouteScheduleSection({
  styles,
  routeDraft,
  isOneTimeRoute,
  isOneTimeRoundTrip,
  onPressDepartureDate,
  onPressReturnDate,
  onChangeOneTimeTripType,
  onPressScheduleTime,
  onPressReturnTime,
}: RouteScheduleSectionProps) {
  const copy = useAppCopy();

  return (
    <>
      {isOneTimeRoute ? (
        <>
          <Label text={copy.common.tripType} styles={styles} />
          <View style={styles.row}>
            <ToggleChip
              label={copy.tripTypes.oneWay}
              active={!isOneTimeRoundTrip}
              onPress={() => onChangeOneTimeTripType("one_way")}
              styles={styles}
            />
            <ToggleChip
              label={copy.tripTypes.roundTrip}
              active={isOneTimeRoundTrip}
              onPress={() => onChangeOneTimeTripType("round_trip")}
              styles={styles}
            />
          </View>

          <RouteDateField
            styles={styles}
            label={copy.common.departureDate}
            value={routeDraft.noticeDate}
            placeholder={copy.common.departureDate}
            onPress={onPressDepartureDate}
          />

          {isOneTimeRoundTrip ? (
            <RouteDateField
              styles={styles}
              label={copy.common.returnDate}
              value={routeDraft.returnDate ?? ""}
              placeholder={copy.common.returnDate}
              onPress={onPressReturnDate}
            />
          ) : null}
        </>
      ) : null}

      <RouteTimeField
        styles={styles}
        label={copy.common.departureTime}
        value={routeDraft.schedule}
        placeholder={copy.common.departureTime}
        onPress={onPressScheduleTime}
      />
      {!isOneTimeRoute || isOneTimeRoundTrip ? (
        <RouteTimeField
          styles={styles}
          label={isOneTimeRoute ? copy.common.returnTime : copy.common.arrivalTime}
          value={routeDraft.returnSchedule}
          placeholder={isOneTimeRoute ? copy.common.returnTime : copy.common.arrivalTime}
          onPress={onPressReturnTime}
        />
      ) : null}
    </>
  );
}
