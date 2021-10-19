import React from "react";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import { Image, Text, View } from "react-native";

import { GuildProps } from "components/Guild";
import { GuildIcon } from "../GuildIcon";
import { categories } from "constants/categories";

import PlayerSvg from "../../assets/player.svg";
import CalendarPng from "../../assets/icons/schedule.png";

import { styles } from "./styles";
import { theme } from "global/styles/theme";
import { LinearGradient } from "expo-linear-gradient";

type AppointmentProps = {
  id: string;
  guild: GuildProps;
  category: string;
  date: string;
  description: string;
};

type Props = RectButtonProps & {
  data: AppointmentProps;
};
export function Appointment({ data, ...rest }: Props) {
  const [category] = categories.filter((item) => item.id === data.category);
  const { owner } = data.guild;
  const { primary, on, secondary50, secondary70 } = theme.colors;

  return (
    <RectButton {...rest}>
      <View style={styles.container}>
        <LinearGradient
          style={styles.guildIconContainer}
          colors={[secondary50, secondary70]}
        >
          <GuildIcon />
        </LinearGradient>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{data.guild.name}</Text>
            <Text style={styles.category}>{category.title}</Text>
          </View>
          <View style={styles.footer}>
            <View style={styles.dateInfo}>
              <Image
                source={CalendarPng}
                style={{ resizeMode: "cover", width: 18, height: 18 }}
              />
              <Text style={styles.date}>{data.date}</Text>
            </View>
            <View style={styles.playersInfo}>
              <PlayerSvg fill={owner ? primary : on} />

              <Text style={[styles.player, { color: owner ? primary : on }]}>
                {owner ? "Anfitrião" : "Visitante"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </RectButton>
  );
}
