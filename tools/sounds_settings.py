import os


class SoundSettings:
    def __init__(self):
        self.__background_music = True
        self.__sound_enabled = True
        self.__volume_level = 50
        self.__path_settings = SoundSettings.__set_path(os.environ.get('LOCALAPPDATA'))
        SoundSettings.__load_setting(self)

    def set_background_music(self):
        if self.__background_music:
            self.__background_music = False
        else:
            self.__background_music = True
        SoundSettings.__save_setting(self)
        return ['true']

    def set_sound_enabled(self):
        if self.__sound_enabled:
            self.__sound_enabled = False
        else:
            self.__sound_enabled = True
        SoundSettings.__save_setting(self)
        return ['true']

    def set_volume_level(self, value):
        if value[0].isdigit():
            if int(value[0]) > 100:
                self.__volume_level = 100
            elif int(value[0]) <= 0:
                self.__volume_level = 0
                self.__sound_enabled = False
                self.__background_music = False
            else:
                self.__volume_level = int(value[0])
        else:
            return 'false'
        self.__sound_enabled = True
        self.__background_music = True
        SoundSettings.__save_setting(self)
        return ['true']

    def get_all_settings(self):
        return [f"{self.__background_music}", f"{self.__sound_enabled}", self.__volume_level]

    # save-loader settings
    def __load_setting(self):
        with open(self.__path_settings, 'r', encoding='utf-8') as file:
            data = file.read()

        if data:
            data = data.split('|')
            music = data[0]
            sound = data[1]
            level_volume = int(data[2])

        else:
            music = True
            sound = True
            level_volume = 50

        self.__background_music = music
        self.__sound_enabled = sound
        self.__volume_level = level_volume
        SoundSettings.__save_setting(self)

    def __save_setting(self):
        with open(self.__path_settings, 'w', encoding='utf-8') as file:
            data = rf"{self.__background_music}|{self.__sound_enabled}|{self.__volume_level}"
            file.write(data)

    @staticmethod
    def __set_path(path):
        if not os.path.isdir(path + '\\TicTacToe_byZeQipe'):
            os.mkdir(path + '\\TicTacToe_byZeQipe')
            return SoundSettings.__set_path(path)

        if not os.path.isfile(path + '\\TicTacToe_byZeQipe\\sound_setting.tzq'):
            file = open(path + '\\TicTacToe_byZeQipe\\sound_setting.tzq', 'w', encoding='utf-8')
            file.close()
            return SoundSettings.__set_path(path)

        return path + '\\TicTacToe_byZeQipe\\sound_setting.tzq'


sound_settings_instance = SoundSettings()
