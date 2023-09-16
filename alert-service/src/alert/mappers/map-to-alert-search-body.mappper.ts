import { IAlert } from '@cso-org/shared';
import { Alert } from '../entities/alert.entity';

export const mapToAlertSearchBody = (alert: Alert): IAlert => {
  return {
    publisherId: alert.publisherId,
    publisherPhoneNumber: alert.publisherPhoneNumber,
    publisherEmail: alert.publisherEmail,
    isFromAppUser: alert.isFromAppUser,
    name: alert.name,
    description: alert.description,
    status: alert.status,
    alertType: alert.alertType,
    icadIdentifier: alert.icadIdentifier,
    petType: alert.petType,
    specie: alert.specie,
    age: alert.age,
    ageExpressedIn: alert.ageExpressedIn,
    sex: alert.sex,
    breed: alert.breed,
    height: alert.height,
    weight: alert.weight,
    hair: alert.hair,
    colors: alert.colors,
    imageUrls: alert.imageUrls,
    hasTatoo: alert.hasTatoo,
    hasNecklace: alert.hasNecklace,
    necklaceMaterial: alert.necklaceMaterial,
    necklaceColor: alert.necklaceColor,
    hasMicrochip: alert.hasMicrochip,
    isSterilized: alert.isSterilized,
    location: alert.location,
    date: new Date(alert.date),
  };
};
