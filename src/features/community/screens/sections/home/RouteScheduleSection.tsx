import type { OneTimeTripType, RouteDraft } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { View } from "react-native";

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
  return (
    <>
      {isOneTimeRoute ? (
        <>
          <Label text="Trip type" styles={styles} />
          <View style={styles.row}>
            <ToggleChip
              label="One-way"
              active={!isOneTimeRoundTrip}
              onPress={() => onChangeOneTimeTripType("one_way")}
              styles={styles}
            />
            <ToggleChip
              label="Round-trip"
              active={isOneTimeRoundTrip}
              onPress={() => onChangeOneTimeTripType("round_trip")}
              styles={styles}
            />
          </View>

          <RouteDateField
            styles={styles}
            label="Departure date"
            value={routeDraft.noticeDate}
            placeholder="Select departure date"
            onPress={onPressDepartureDate}
          />

          {isOneTimeRoundTrip ? (
            <RouteDateField
              styles={styles}
              label="Return date"
              value={routeDraft.returnDate ?? ""}
              placeholder="Select return date"
              onPress={onPressReturnDate}
            />
          ) : null}
        </>
      ) : null}

      <RouteTimeField
        styles={styles}
        label={isOneTimeRoute ? "Departure time" : "Departure time"}
        value={routeDraft.schedule}
        placeholder={isOneTimeRoute ? "Select departure time" : "Select departure time"}
        onPress={onPressScheduleTime}
      />
      {!isOneTimeRoute || isOneTimeRoundTrip ? (
        <RouteTimeField
          styles={styles}
          label={isOneTimeRoute ? "Return time" : "Arrival time"}
          value={routeDraft.returnSchedule}
          placeholder={isOneTimeRoute ? "Select return time" : "Select arrival time"}
          onPress={onPressReturnTime}
        />
      ) : null}
    </>
  );
}
