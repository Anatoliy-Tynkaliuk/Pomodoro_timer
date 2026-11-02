import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Vibration } from 'react-native';

export default function HomeScreen() {
  const [workHours, setWorkHours] = useState('0');
  const [workMinutes, setWorkMinutes] = useState('25');
  const [workSeconds, setWorkSeconds] = useState('0');

  const [breakHours, setBreakHours] = useState('0');
  const [breakMinutes, setBreakMinutes] = useState('5');
  const [breakSeconds, setBreakSeconds] = useState('0');

  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const getTotalSeconds = (
    hours: string,
    minutes: string,
    seconds: string,
    defaultSeconds: number
  ): number => {
    const h = Number(hours);
    const m = Number(minutes);
    const s = Number(seconds);

    if (
      Number.isNaN(h) ||
      Number.isNaN(m) ||
      Number.isNaN(s) ||
      h < 0 ||
      m < 0 ||
      s < 0
    ) {
      return defaultSeconds;
    }

    const totalSeconds = h * 3600 + m * 60 + s;

    if (totalSeconds <= 0) {
      return defaultSeconds;
    }

    return totalSeconds;
  };

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((currentSeconds) => {
        if (currentSeconds > 0) {
          return currentSeconds - 1;
        }

        return 0;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft !== 0 || !isRunning) {
      return;
    }

    Vibration.vibrate([0, 600, 600, 600, 600]);

    const workTime = getTotalSeconds(
      workHours,
      workMinutes,
      workSeconds,
      25 * 60
    );

    const breakTime = getTotalSeconds(
      breakHours,
      breakMinutes,
      breakSeconds,
      5 * 60
    );

    if (mode === 'work') {
      setMode('break');
      setSecondsLeft(breakTime);
    } else {
      setMode('work');
      setSecondsLeft(workTime);
    }
  }, [
    secondsLeft,
    isRunning,
    mode,
    workHours,
    workMinutes,
    workSeconds,
    breakHours,
    breakMinutes,
    breakSeconds,
  ]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');

    const workTime = getTotalSeconds(
      workHours,
      workMinutes,
      workSeconds,
      25 * 60
    );

    setSecondsLeft(workTime);
  };

  const updateWorkTimer = (
    hours: string,
    minutes: string,
    seconds: string
  ) => {
    if (!isRunning && mode === 'work') {
      const total = getTotalSeconds(
        hours,
        minutes,
        seconds,
        25 * 60
      );

      setSecondsLeft(total);
    }
  };

  const updateBreakTimer = (
    hours: string,
    minutes: string,
    seconds: string
  ) => {
    if (!isRunning && mode === 'break') {
      const total = getTotalSeconds(
        hours,
        minutes,
        seconds,
        5 * 60
      );

      setSecondsLeft(total);
    }
  };

  const handleWorkHoursChange = (value: string) => {
    setWorkHours(value);

    updateWorkTimer(
      value,
      workMinutes,
      workSeconds
    );
  };

  const handleWorkMinutesChange = (value: string) => {
    setWorkMinutes(value);

    updateWorkTimer(
      workHours,
      value,
      workSeconds
    );
  };

  const handleWorkSecondsChange = (value: string) => {
    setWorkSeconds(value);

    updateWorkTimer(
      workHours,
      workMinutes,
      value
    );
  };

  const handleBreakHoursChange = (value: string) => {
    setBreakHours(value);

    updateBreakTimer(
      value,
      breakMinutes,
      breakSeconds
    );
  };

  const handleBreakMinutesChange = (value: string) => {
    setBreakMinutes(value);

    updateBreakTimer(
      breakHours,
      value,
      breakSeconds
    );
  };

  const handleBreakSecondsChange = (value: string) => {
    setBreakSeconds(value);

    updateBreakTimer(
      breakHours,
      breakMinutes,
      value
    );
  };

  const selectWorkMode = () => {
    if (isRunning) {
      return;
    }

    const workTime = getTotalSeconds(
      workHours,
      workMinutes,
      workSeconds,
      25 * 60
    );

    setMode('work');
    setSecondsLeft(workTime);
  };

  const selectBreakMode = () => {
    if (isRunning) {
      return;
    }

    const breakTime = getTotalSeconds(
      breakHours,
      breakMinutes,
      breakSeconds,
      5 * 60
    );

    setMode('break');
    setSecondsLeft(breakTime);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          Pomodoro Timer
        </Text>

        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'work' &&
                styles.activeModeButton,
            ]}
            onPress={selectWorkMode}
            disabled={isRunning}
          >
            <Text
              style={[
                styles.modeButtonText,
                mode === 'work' &&
                  styles.activeModeButtonText,
              ]}
            >
              Робота
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'break' &&
                styles.activeModeButton,
            ]}
            onPress={selectBreakMode}
            disabled={isRunning}
          >
            <Text
              style={[
                styles.modeButtonText,
                mode === 'break' &&
                  styles.activeModeButtonText,
              ]}
            >
              Перерва
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.currentMode}>
          {mode === 'work'
            ? 'Працюй краще'
            : 'Ну, а тепер нормально відпочивай'}
        </Text>

        <View style={styles.timeDisplay}>
          <Text style={styles.timer}>
            {formatTime(secondsLeft)}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          {!isRunning ? (
            <TouchableOpacity
              style={[
                styles.controlButton,
                styles.startButton,
              ]}
              onPress={startTimer}
            >
              <Text style={styles.controlButtonText}>
                Старт
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.controlButton,
                styles.stopButton,
              ]}
              onPress={stopTimer}
            >
              <Text style={styles.controlButtonText}>
                Стоп
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.resetButton,
            ]}
            onPress={resetTimer}
          >
            <Text style={styles.controlButtonText}>
              Скинути
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>
            Налаштування
          </Text>

          <Text style={styles.sectionTitle}>
            Робочий час
          </Text>

          <View style={styles.timeInputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Години
              </Text>

              <TextInput
                style={styles.timeInput}
                value={workHours}
                onChangeText={handleWorkHoursChange}
                keyboardType="numeric"
                placeholder="0"
                editable={!isRunning}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Хвилини
              </Text>

              <TextInput
                style={styles.timeInput}
                value={workMinutes}
                onChangeText={handleWorkMinutesChange}
                keyboardType="numeric"
                placeholder="25"
                editable={!isRunning}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Секунди
              </Text>

              <TextInput
                style={styles.timeInput}
                value={workSeconds}
                onChangeText={handleWorkSecondsChange}
                keyboardType="numeric"
                placeholder="0"
                editable={!isRunning}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            Час перерви
          </Text>

          <View style={styles.timeInputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Години
              </Text>

              <TextInput
                style={styles.timeInput}
                value={breakHours}
                onChangeText={handleBreakHoursChange}
                keyboardType="numeric"
                placeholder="0"
                editable={!isRunning}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Хвилини
              </Text>

              <TextInput
                style={styles.timeInput}
                value={breakMinutes}
                onChangeText={handleBreakMinutesChange}
                keyboardType="numeric"
                placeholder="5"
                editable={!isRunning}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Секунди
              </Text>

              <TextInput
                style={styles.timeInput}
                value={breakSeconds}
                onChangeText={handleBreakSecondsChange}
                keyboardType="numeric"
                placeholder="0"
                editable={!isRunning}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121826',
  },

  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 50,
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 25,
    textAlign: 'center',
  },

  modeContainer: {
    flexDirection: 'row',
    backgroundColor: '#1d2638',
    borderRadius: 14,
    padding: 5,
    marginBottom: 25,
  },

  modeButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },

  activeModeButton: {
    backgroundColor: '#a304ff',
  },

  modeButtonText: {
    color: '#aeb8cc',
    fontSize: 16,
    fontWeight: '600',
  },

  activeModeButtonText: {
    color: '#ffffff',
  },

  currentMode: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },

  timeDisplay: {
    width: 310,
    height: 180,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#700292',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#192235',
    marginBottom: 35,
  },

  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 35,
  },

  controlButton: {
    minWidth: 120,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },

  startButton: {
    backgroundColor: '#058851',
  },

  stopButton: {
    backgroundColor: '#f0a93b',
  },

  resetButton: {
    backgroundColor: '#aa0000',
  },

  controlButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  settingsContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#192235',
    borderRadius: 18,
    padding: 20,
  },

  settingsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },

  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 5,
  },

  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  inputContainer: {
    width: '31%',
  },

  label: {
    color: '#d7deed',
    fontSize: 13,
    marginBottom: 7,
    textAlign: 'center',
  },

  timeInput: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 17,
    textAlign: 'center',
  },
});