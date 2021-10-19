import { theme } from "global/styles/theme";
import { StyleSheet } from "react-native";
import {
  getBottomSpace,
  getStatusBarHeight,
} from "react-native-iphone-x-helper";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  containerGradient: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  autor: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },

  title: {
    fontFamily: theme.fonts.title700,
    color: theme.colors.heading,
    fontSize: 18,
  },
  subTitle: {
    fontFamily: theme.fonts.title700,
    color: theme.colors.heading,
    fontSize: 16,
    textAlign: "justify",
  },
  aditionalInfo: {
    marginTop: 12,
  },
  containerDivider: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 27,
  },
  resume: {
    marginVertical: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    margin: getBottomSpace(),
  },
});
