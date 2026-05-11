/* eslint-disable react/no-unknown-property */
'use client';

import { DialRoot } from 'dialkit';

export default function DialkitRoot() {
  return <DialRoot position="top-right" defaultOpen={false} productionEnabled />;
}

