'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface DeValkAccommodationProps {
  form: UseFormReturn<any>;
}

export default function DeValkAccommodation({ form }: DeValkAccommodationProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🏠 Accommodation</h2>
        <p className="text-gray-600">Details about the yacht's accommodation (De Valk exact structure)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1 - Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CABINS
            </label>
            <input
              type="text"
              {...register('accommodation.cabins')}
              placeholder="e.g., 3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BERTHS
            </label>
            <input
              type="text"
              {...register('accommodation.berths')}
              placeholder="e.g., 9"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              INTERIOR
            </label>
            <input
              type="text"
              {...register('accommodation.interior')}
              placeholder="e.g., teak"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LAYOUT
            </label>
            <input
              type="text"
              {...register('accommodation.layout')}
              placeholder="e.g., Classic | Warm"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              FLOOR
            </label>
            <input
              type="text"
              {...register('accommodation.floor')}
              placeholder="e.g., teak and holly"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OPEN COCKPIT
            </label>
            <input
              type="text"
              {...register('accommodation.openCockpit')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AFT DECK
            </label>
            <input
              type="text"
              {...register('accommodation.aftDeck')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SALOON
            </label>
            <input
              type="text"
              {...register('accommodation.saloon')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Column 2 - Saloon & Galley */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HEADROOM SALOON (M)
            </label>
            <input
              type="text"
              {...register('accommodation.headroomSaloonM')}
              placeholder="e.g., 1.95 mtr"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HEATING
            </label>
            <input
              type="text"
              {...register('accommodation.heating')}
              placeholder="e.g., 2x webasto HL32 diesel heater"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NAVIGATION CENTER
            </label>
            <input
              type="text"
              {...register('accommodation.navigationCenter')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CHART TABLE
            </label>
            <input
              type="text"
              {...register('accommodation.chartTable')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GALLEY
            </label>
            <input
              type="text"
              {...register('accommodation.galley')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              COUNTERTOP
            </label>
            <input
              type="text"
              {...register('accommodation.countertop')}
              placeholder="e.g., wood"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SINK
            </label>
            <input
              type="text"
              {...register('accommodation.sink')}
              placeholder="e.g., stainless steel | Double"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              COOKER
            </label>
            <input
              type="text"
              {...register('accommodation.cooker')}
              placeholder="e.g., calor gas Eno | 2019 | Double burner"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Column 3 - Appliances & Systems */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OVEN
            </label>
            <input
              type="text"
              {...register('accommodation.oven')}
              placeholder="e.g., In cooker"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MICROWAVE
            </label>
            <input
              type="text"
              {...register('accommodation.microwave')}
              placeholder="e.g., Electrolux NF4014 230 V"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              FRIDGE
            </label>
            <input
              type="text"
              {...register('accommodation.fridge')}
              placeholder="e.g., Dometic CU55"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              FREEZER
            </label>
            <input
              type="text"
              {...register('accommodation.freezer')}
              placeholder="e.g., Frigoboat freezer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HOT WATER SYSTEM
            </label>
            <input
              type="text"
              {...register('accommodation.hotWaterSystem')}
              placeholder="e.g., 220V + engine EG Inox boiler"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WATER PRESSURE SYSTEM
            </label>
            <input
              type="text"
              {...register('accommodation.waterPressureSystem')}
              placeholder="e.g., electrical"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Owner's Cabin Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner's Cabin</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OWNERS CABIN
            </label>
            <input
              type="text"
              {...register('accommodation.ownersCabin')}
              placeholder="e.g., twin single"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BED LENGTH (M)
            </label>
            <input
              type="text"
              {...register('accommodation.bedLengthM')}
              placeholder="e.g., 0.85x2.05 mtr and 1.25x2.05 mtr"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WARDROBE
            </label>
            <input
              type="text"
              {...register('accommodation.wardrobe')}
              placeholder="e.g., hanging and shelves"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BATHROOM
            </label>
            <input
              type="text"
              {...register('accommodation.bathroom')}
              placeholder="e.g., en suite"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TOILET
            </label>
            <input
              type="text"
              {...register('accommodation.toilet')}
              placeholder="e.g., en suite"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TOILET SYSTEM
            </label>
            <input
              type="text"
              {...register('accommodation.toiletSystem')}
              placeholder="e.g., manual | Jabsco"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WASH BASIN
            </label>
            <input
              type="text"
              {...register('accommodation.washBasin')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SHOWER
            </label>
            <input
              type="text"
              {...register('accommodation.shower')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Guest Cabins Section */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Cabins</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guest Cabin 1 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Guest Cabin 1</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GUEST CABIN 1
              </label>
              <input
                type="text"
                {...register('accommodation.guestCabin1')}
                placeholder="e.g., v-bed"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BED LENGTH (M)
              </label>
              <input
                type="text"
                {...register('accommodation.bedLengthM1')}
                placeholder="e.g., 2.00x2.04 mtr"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WARDROBE
              </label>
              <input
                type="text"
                {...register('accommodation.wardrobe1')}
                placeholder="e.g., hanging and shelves"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Guest Cabin 2 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Guest Cabin 2</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GUEST CABIN 2
              </label>
              <input
                type="text"
                {...register('accommodation.guestCabin2')}
                placeholder="e.g., bunk bed"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BED LENGTH (M)
              </label>
              <input
                type="text"
                {...register('accommodation.bedLengthM2')}
                placeholder="e.g., Upper bed: 0.84x2.00 mtr | Lower bed 0.88x2.00 mtr"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WARDROBE
              </label>
              <input
                type="text"
                {...register('accommodation.wardrobe2')}
                placeholder="e.g., hanging and shelves"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Shared Facilities */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BATHROOM
            </label>
            <input
              type="text"
              {...register('accommodation.bathroom2')}
              placeholder="e.g., shared"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TOILET
            </label>
            <input
              type="text"
              {...register('accommodation.toilet2')}
              placeholder="e.g., shared"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TOILET SYSTEM
            </label>
            <input
              type="text"
              {...register('accommodation.toiletSystem2')}
              placeholder="e.g., manual"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WASH BASIN
            </label>
            <input
              type="text"
              {...register('accommodation.washBasin2')}
              placeholder="e.g., in the bathroom"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SHOWER
            </label>
            <input
              type="text"
              {...register('accommodation.shower2')}
              placeholder="e.g., shared"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WASHING MACHINE
            </label>
            <input
              type="text"
              {...register('accommodation.washingMachine')}
              placeholder="e.g., Kenny Compact washingmachine"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Field Count Display */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>De Valk Accommodation Fields:</strong> 35 fields for maximum data extraction
        </p>
      </div>
    </div>
  );
}
