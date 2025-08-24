'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface DeValkEquipmentProps {
  form: UseFormReturn<any>;
}

export default function DeValkEquipment({ form }: DeValkEquipmentProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🛠️ Equipment</h2>
        <p className="text-gray-600">Details about the yacht's equipment and deck systems (De Valk exact structure)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1 - Deck & Cockpit */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              FIXED WINDSCREEN
            </label>
            <input
              type="text"
              {...register('equipment.fixedWindscreen')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              COCKPIT TABLE
            </label>
            <input
              type="text"
              {...register('equipment.cockpitTable')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BATHING PLATFORM
            </label>
            <input
              type="text"
              {...register('equipment.bathingPlatform')}
              placeholder="e.g., Custom made stainless steel and teak"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BOARDING LADDER
            </label>
            <input
              type="text"
              {...register('equipment.boardingLadder')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DECK SHOWER
            </label>
            <input
              type="text"
              {...register('equipment.deckShower')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DECK WASH
            </label>
            <input
              type="text"
              {...register('equipment.deckWash')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEA RAILING
            </label>
            <input
              type="text"
              {...register('equipment.seaRailing')}
              placeholder="e.g., wire"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GRAB RAIL (SUPERSTRUCTURE)
            </label>
            <input
              type="text"
              {...register('equipment.grabRailSuperstructure')}
              placeholder="e.g., teak"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Column 2 - Anchoring & Safety */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ANCHOR
            </label>
            <input
              type="text"
              {...register('equipment.anchor')}
              placeholder="e.g., 40 kg Rocna"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ANCHOR CHAIN
            </label>
            <input
              type="text"
              {...register('equipment.anchorChain')}
              placeholder="e.g., 80 mtr calibrated chain"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ANCHOR 2
            </label>
            <input
              type="text"
              {...register('equipment.anchor2')}
              placeholder="e.g., Spare Aluminium 34 kg CQR"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WINDLASS
            </label>
            <input
              type="text"
              {...register('equipment.windlass')}
              placeholder="e.g., electrical Lofrans Albatross 1500 W"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PUSHPIT
            </label>
            <input
              type="text"
              {...register('equipment.pushpit')}
              placeholder="e.g., With teak seats"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PULPIT
            </label>
            <input
              type="text"
              {...register('equipment.pulpit')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LIFEBUOY
            </label>
            <input
              type="text"
              {...register('equipment.lifebuoy')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RADAR REFLECTOR
            </label>
            <input
              type="text"
              {...register('equipment.radarReflector')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Column 3 - Tender & Entertainment */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DINGHY
            </label>
            <input
              type="text"
              {...register('equipment.dinghy')}
              placeholder="e.g., Avon 2.8 mtr"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OUTBOARD
            </label>
            <input
              type="text"
              {...register('equipment.outboard')}
              placeholder="e.g., New 2022 | Mariner F4 4hp 4 stroke"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DAVITS
            </label>
            <input
              type="text"
              {...register('equipment.davits')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              FENDERS
            </label>
            <input
              type="text"
              {...register('equipment.fenders')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MOORING LINES
            </label>
            <input
              type="text"
              {...register('equipment.mooringLines')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RADIO
            </label>
            <input
              type="text"
              {...register('equipment.radio')}
              placeholder="e.g., Sony"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              COCKPIT SPEAKERS
            </label>
            <input
              type="text"
              {...register('equipment.cockpitSpeakers')}
              placeholder="e.g., 2x Sony xplod"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SPEAKERS IN SALON
            </label>
            <input
              type="text"
              {...register('equipment.speakersInSalon')}
              placeholder="e.g., 2x Sony xplod"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Additional Equipment Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Equipment & Safety</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                FIRE EXTINGUISHER
              </label>
              <input
                type="text"
                {...register('equipment.fireExtinguisher')}
                placeholder="e.g., yes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                EXTINGUISHER IN ENGINE ROOM
              </label>
              <input
                type="text"
                {...register('equipment.extinguisherInEngineRoom')}
                placeholder="e.g., yes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LIFE RAFT CONTAINER
              </label>
              <input
                type="text"
                {...register('equipment.lifeRaftContainer')}
                placeholder="e.g., Lifeguard Equipment"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LIFE RAFT (PERS)
              </label>
              <input
                type="text"
                {...register('equipment.lifeRaftPers')}
                placeholder="e.g., 6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LAST LIFE RAFT SURVEY
              </label>
              <input
                type="text"
                {...register('equipment.lastLifeRaftSurvey')}
                placeholder="e.g., 2018 (needs service)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DANBUOY
              </label>
              <input
                type="text"
                {...register('equipment.danbuoy')}
                placeholder="e.g., yes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SAFETY LINES ON DECK
              </label>
              <input
                type="text"
                {...register('equipment.safetyLinesOnDeck')}
                placeholder="e.g., yes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RIGGING CONTROLS
              </label>
              <input
                type="text"
                {...register('equipment.riggingControls')}
                placeholder="e.g., manual"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DECK CRANE
              </label>
              <input
                type="text"
                {...register('equipment.deckCrane')}
                placeholder="e.g., manual"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RAILING SIDE OPENING GATES
              </label>
              <input
                type="text"
                {...register('equipment.railingSideOpeningGates')}
                placeholder="e.g., yes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Entertainment & Technology Section */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Entertainment & Technology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TV FLATSCREENS
              </label>
              <input
                type="text"
                {...register('equipment.tvFlatscreens')}
                placeholder="e.g., yes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SATELLITE
              </label>
              <input
                type="text"
                {...register('equipment.satellite')}
                placeholder="e.g., Starlink"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RADIO-CD PLAYER
              </label>
              <input
                type="text"
                {...register('equipment.radioCdPlayer')}
                placeholder="e.g., Alpine"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IPOD CONNECTION
              </label>
              <input
                type="text"
                {...register('equipment.ipodConnection')}
                placeholder="e.g., yes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SPARE PARTS
              </label>
              <input
                type="text"
                {...register('equipment.spareParts')}
                placeholder="e.g., yes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Field Count Display */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>De Valk Equipment Fields:</strong> 30+ fields for maximum data extraction
        </p>
      </div>
    </div>
  );
}
