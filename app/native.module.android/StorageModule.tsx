/* eslint-disable prettier/prettier */
import {NativeModules} from 'react-native';
const {StorageModule} = NativeModules;

interface IStorageModule {
    setItem(key : string, value : string) : void;
    getItem(key: string): Promise<string>;
}

export default StorageModule as IStorageModule;