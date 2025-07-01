#!/usr/bin/env node

import { hiddenBin } from 'clippium'
import process       from 'node:process'

import cli from './index'

await cli.run( hiddenBin( process.argv ) )
