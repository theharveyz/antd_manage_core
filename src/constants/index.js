export * from './http';
export * from './common';
import { TASK_STATUS, TASK_TYPES } from './task';
import DI from '../di';

DI.bindValue('TASK_STATUS', TASK_STATUS);
DI.bindValue('TASK_TYPES', TASK_TYPES);
