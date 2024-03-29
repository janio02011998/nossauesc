import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ImageBackground,
  ToastAndroid,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { RectButton } from "react-native-gesture-handler";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/core";

import { Courses } from "screens/Courses";
import { useAuth } from "hooks/auth";

import { CategorySelect } from "components/CategorySelect";
import { Background } from "components/Background";
import { HoursMinutes } from "components/HoursMinutes";
import { GuildIcon } from "components/GuildIcon";
import { TextArea } from "components/TextArea";
import { Header } from "components/Header";
import { Button } from "components/Button";
import { GuildProps } from "components/Guild";
import { ButtonDay } from "components/ButtonDay";
import { ModalView } from "components/ModalView";
import { SingleEvent } from "components/SingleEvent";
import { InputText } from "components/InputText";
import { CAM } from "components/Camera";

import { formartSchedule } from "Utils/formartSchedule";
import { formartScheduleWeek } from "Utils/formatScheduleWeek";
import { createAcademicResearch } from "services/createAcademicResearch";
import { daysOfWeek } from "constants/daysOfWeek";

import { theme } from "global/styles/theme";
import { styles } from "./styles";
import { createActivityStudent } from "services/createActivityStudenty";
import { createSolidarity } from "services/createSolidarity";

interface IFormData {
  banner: string;
  description: string;
  phrase: string;
  location: string;
  title: string;
  searchArea: string;
}

export function AppointmentCreate() {
  const { user } = useAuth();
  const { goBack } = useNavigation();

  const [days, setDays] = useState<string[]>([]);
  const [category, setCategory] = useState<string>(user.role === "student" ? "5" : "1");
  const [bannerURI, setBannerURI] = useState<string>("");

  const categoriesWithFieldsRequired: string[] = ["2", "3", "4"];
  const [course, setCourse] = useState<GuildProps>({} as GuildProps);

  const [openGuildsModal, setOpenGuildsModal] = useState(false);
  const [isSchedule, setIsSchedule] = useState(false);
  const [dataTimer, setDataTimer] = useState({
    date: "",
    mounth: "",
    hours: "",
    minute: "",
  });
  const [dataTimerWeek, setDataTimerWeek] = useState<any>({});
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<IFormData>({ mode: "onBlur" });

  const onSubmit = (data: any) => {
    if (category === "1" && (!course.name || course.name === "")) {
      ToastAndroid.show("Prencha todos os campos!", ToastAndroid.SHORT);
      return;
    }

    if (category === "1") {
      createAcademicResearch(
        "academic_research",
        { ...data, course: course.name },
        user
      );
    }

    if (categoriesWithFieldsRequired.includes(category)) {
      const schedule = formartSchedule(dataTimer);
      const weekSchedule = formartScheduleWeek(dataTimerWeek);

      createActivityStudent(
        "actitivity_student",
        {
          course: course.name,
          banner: bannerURI,
          schedule: isSchedule ? null : schedule,
          weekSchedule: isSchedule ? weekSchedule : null,
          categoryId: category,
          members: [],
          isActivity: true,
          ...data,
        },
        user
      );
    }

    if (category === "5") {
      createSolidarity("solidarity", { ...data, banner: bannerURI }, user);
    }
    clearFields();
    goBack();
  };

  const clearFields = () => {
    setDays([]);
    setCategory("1");
    setBannerURI("");
    setCourse({} as GuildProps);
    setOpenGuildsModal(false);
    setIsSchedule(false);
    setDataTimer({
      date: "",
      mounth: "",
      hours: "",
      minute: "",
    });
  };

  const totalDaysSchedule = (day: string) => {
    if (days.includes(day)) {
      const clearArray = days.filter((item) => day !== item);
      setDays(clearArray);
    } else {
      setDays([...days, day]);
    }
  };

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult: any = await ImagePicker.launchImageLibraryAsync();
    return pickerResult.uri;
  };

  const toggleSwitch = () => {
    setIsSchedule(!isSchedule);
  };

  const handleOpenGuilds = () => {
    setOpenGuildsModal(true);
  };

  const handleCloseModal = () => {
    setOpenGuildsModal(false);
  };

  const handleCourseSelect = (courseSelect: GuildProps) => {
    setOpenGuildsModal(false);
    setCourse(courseSelect);
  };

  const handleCategorySelect = (categoryId: string) => {
    setCategory(categoryId);
  };

  const handleDataTimer = (value: any) => {
    setDataTimer((prevState) => {
      return { ...prevState, ...value };
    });
  };

  const handleDataTimerWeek = (value: any, day: string) => {
    setDataTimerWeek((prevState: any) => {
      const daySelect = {
        [day]: {
          ...prevState[day],
          ...value,
        },
      };

      return { ...prevState, ...daySelect };
    });
  };

  function renderScheduleOrSingleEvent() {
    return (
      <>
        {isSchedule ? (
          <>
            <View>
              <Text style={[styles.label, { marginTop: 12 }]}>Agenda</Text>
              <View style={styles.week}>
                {daysOfWeek.map((dayItem) => (
                  <ButtonDay
                    key={dayItem}
                    day={dayItem}
                    handleSchedule={() => totalDaysSchedule(dayItem)}
                  />
                ))}
              </View>
            </View>

            {days.map((item) => (
              <View>
                <Text style={styles.title}>{item}</Text>
                <HoursMinutes
                  handleDataTimerWeek={handleDataTimerWeek}
                  day={item}
                />
              </View>
            ))}
          </>
        ) : (
          <SingleEvent handleDataTimer={handleDataTimer} />
        )}
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Background>
        <Header title="Agendar evento" />
        <ScrollView>
          <Text
            style={[
              styles.label,
              { marginLeft: 24, marginTop: 36, marginBottom: 36 },
            ]}
          >
            Categoria
          </Text>

          <CategorySelect
            hasCheckBox
            faqDisable
            setCategory={handleCategorySelect}
            categorySelected={category}
          />

          <View style={styles.form}>
            {category === "1" ? (
              <>
                <RectButton onPress={handleOpenGuilds}>
                  <View style={styles.select}>
                    {course.icon === "default" ? (
                      <GuildIcon />
                    ) : (
                      <View style={styles.image} />
                    )}

                    <View style={styles.selectBody}>
                      <Text style={styles.label}>
                        {course.name ? course.name : "Selecione o curso"}
                      </Text>
                    </View>

                    <Feather
                      name="chevron-right"
                      size={18}
                      color={theme.colors.heading}
                    />
                  </View>
                </RectButton>
                <View>
                  <View style={styles.field}>
                    <Text style={[styles.label, { marginBottom: 12 }]}>
                      Titulo da pesquisa
                    </Text>
                    <Text style={styles.caracteresLimit}>
                      Max 80 caracteres
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name="title"
                    defaultValue=""
                    render={({ field: { onChange, value, onBlur } }) => (
                      <InputText
                        maxLength={80}
                        placeholder="Titulo da pesquisa"
                        autoCorrect={false}
                        onChangeText={(value) => onChange(value)}
                      />
                    )}
                    rules={{
                      required: {
                        value: categoriesWithFieldsRequired.includes(category)
                          ? true
                          : false,
                        message: "Preencha todos os campos!",
                      },
                    }}
                  />
                  <View style={styles.field}>
                    <Text style={[styles.label, { marginBottom: 12 }]}>
                      Área de pesquisa
                    </Text>
                    <Text style={styles.caracteresLimit}>
                      Max 80 caracteres
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name="searchArea"
                    defaultValue=""
                    render={({ field: { onChange, value, onBlur } }) => (
                      <InputText
                        maxLength={80}
                        placeholder="Processamento de imagens; Blockchain."
                        autoCorrect={false}
                        onChangeText={(value) => onChange(value)}
                      />
                    )}
                    rules={{
                      required: {
                        value: categoriesWithFieldsRequired.includes(category)
                          ? true
                          : false,
                        message: "Preencha todos os campos!",
                      },
                    }}
                  />
                </View>
              </>
            ) : (
              <>
                <View>
                  {bannerURI === "" ? (
                    <View>
                      <Text style={styles.title}>{category === "5" ? "Adicionar foto" : "Adicionar banner"}</Text>
                      <Controller
                        control={control}
                        name="banner"
                        defaultValue=""
                        render={({ field: { onChange, value, onBlur } }) => (
                          <CAM
                            onPress={async () => {
                              const uri = await openImagePickerAsync();
                              setBannerURI(uri);
                              onChange(uri);
                            }}
                          />
                        )}
                        rules={{
                          required: {
                            value: categoriesWithFieldsRequired.includes(
                              category
                            )
                              ? true
                              : false,
                            message: "Preencha todos os campos!",
                          },
                        }}
                      />
                    </View>
                  ) : (
                    <View>
                      <RectButton onPress={() => setBannerURI("")}>
                        <Text style={styles.title}>Remover banner</Text>
                      </RectButton>
                      <ImageBackground
                        source={{
                          uri: bannerURI,
                        }}
                        style={styles.bannerWrapper}
                      />
                    </View>
                  )}
                </View>
                {category !== "5" && (
                  <>
                    <View>
                      <Switch
                        style={{ marginTop: 12 }}
                        onValueChange={toggleSwitch}
                        value={isSchedule}
                      />
                    </View>
                    {renderScheduleOrSingleEvent()}
                  </>
                )}
              </>
            )}

            <View style={styles.field}>
              <Text style={[styles.label, { marginBottom: 12 }]}>
                Descrição
              </Text>
              <Text style={styles.caracteresLimit}>Max 500 caracteres</Text>
            </View>
            <Controller
              control={control}
              name="description"
              defaultValue=""
              render={({ field: { onChange, value, onBlur } }) => (
                <TextArea
                  multiline
                  maxLength={500}
                  numberOfLines={5}
                  autoCorrect={false}
                  onChangeText={(value) => onChange(value)}
                />
              )}
              rules={{
                required: {
                  value: true,
                  message: "Descrição não pode está vazia",
                },
              }}
            />
            {category !== "5" && category !== "1" && (
              <>
                <View style={styles.field}>
                  <Text style={[styles.label, { marginBottom: 12 }]}>
                    Nome do grupo
                  </Text>
                  <Text style={styles.caracteresLimit}>Max 15 caracteres</Text>
                </View>
                <Controller
                  control={control}
                  name="title"
                  defaultValue=""
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputText
                      maxLength={80}
                      placeholder="Cinema"
                      autoCorrect={false}
                      onChangeText={(value) => onChange(value)}
                    />
                  )}
                  rules={{
                    required: {
                      value: categoriesWithFieldsRequired.includes(category)
                        ? true
                        : false,
                      message: "Preencha todos os campos!",
                    },
                  }}
                />
                <View style={styles.field}>
                  <Text style={[styles.label, { marginBottom: 12 }]}>
                    Frase de apresentação
                  </Text>
                  <Text style={styles.caracteresLimit}>Max 80 caracteres</Text>
                </View>
                <Controller
                  control={control}
                  name="phrase"
                  defaultValue=""
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputText
                      maxLength={80}
                      placeholder="Junte-se ao nosso grupo :D"
                      autoCorrect={false}
                      onChangeText={(value) => onChange(value)}
                    />
                  )}
                  rules={{
                    required: {
                      value: categoriesWithFieldsRequired.includes(category)
                        ? true
                        : false,
                      message: "Preencha todos os campos!",
                    },
                  }}
                />

                <View style={styles.field}>
                  <Text style={[styles.label, { marginBottom: 12 }]}>
                    Localização
                  </Text>
                  <Text style={styles.caracteresLimit}>Max 80 caracteres</Text>
                </View>
                <Controller
                  control={control}
                  name="location"
                  defaultValue=""
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputText
                      maxLength={80}
                      placeholder="Pavilhão Adonias Filho, Sala 19B5"
                      autoCorrect={false}
                      onChangeText={(value) => onChange(value)}
                    />
                  )}
                  rules={{
                    required: {
                      value: categoriesWithFieldsRequired.includes(category)
                        ? true
                        : false,
                      message: "Preencha todos os campos!",
                    },
                  }}
                />
              </>
            )}
            <View style={styles.footer}>
              <Button title="Agendar" onPress={handleSubmit(onSubmit)} />
            </View>
          </View>
        </ScrollView>
        <ModalView visible={openGuildsModal} closeModal={handleCloseModal}>
          <Courses handleGuildSelect={handleCourseSelect} />
        </ModalView>
      </Background>
    </KeyboardAvoidingView>
  );
}
