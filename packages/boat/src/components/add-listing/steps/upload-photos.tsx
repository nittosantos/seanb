'use client';

import { useTranslations } from 'next-intl';
import UploadedPhotoPreview from '@/components/add-listing/uploaded-photo-preview';
import CreateListingFooter from '@/components/footer/create-listing-footer';
import { useAddListingForm, useAddListingStore } from '@/stores/add-listing-store';
import Text from '@/components/ui/typography/text';
import Upload from '@/components/ui/upload';

let newImgArr: any = [];

export default function AddBoatPhotos() {
  const t = useTranslations('addListing');
  const setStep = useAddListingStore((s) => s.setStep);
  const [store, setStore] = useAddListingForm();

  function handleDropAccepted(e: any) {
    e.forEach((item: any) => {
      newImgArr.push({
        id: `upload-${URL.createObjectURL(item)}`,
        img: URL.createObjectURL(item),
      });
    });
    console.log(e);
    setStore({ ...store, images: newImgArr });
  }

  return (
    <div className="w-full max-w-[448px] xl:max-w-[648px]">
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <Upload
          accept="img"
          label={t('addPhotos')}
          onDropAccepted={handleDropAccepted}
          labelClassName="md:!text-2xl md:leading-7 mb-5 md:mb-6"
          iconClassName="w-12 h-16 md:w-20 md:h-20 !text-gray-dark"
          className="h-[262px] pt-12 pb-9 xl:h-[500px] xl:pb-14 xl:pt-32"
          text={
            <div className="flex h-full flex-col justify-between text-center">
              <div>
                <Text
                  tag="h3"
                  className="text-lg font-normal leading-6 text-gray-dark"
                >
                  {t('dragPhotos')}
                </Text>
                <Text className="mt-3 text-gray">{t('chooseAtLeast1')}</Text>
              </div>
              <Text className="text-gray underline">
                {t('uploadFromDevice')}
              </Text>
            </div>
          }
        >
          {({ files, setFiles }) => (
            <div className="mt-3 grid grid-cols-2 gap-2 lg:gap-3">
              {files.map((file, index) => (
                <UploadedPhotoPreview
                  key={`uploaded-${index}`}
                  file={file}
                  onDelete={() => {
                    const updatedFiles = files.filter((_, i) => i !== index);
                    setFiles(updatedFiles);
                  }}
                />
              ))}
            </div>
          )}
        </Upload>
        <CreateListingFooter
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      </form>
    </div>
  );
}
