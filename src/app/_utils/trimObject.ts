export const trimObjectAfterSave = (object) => {
   for (var key in object) {
      if (object[key].trim)
         object[key] = object[key].trim();
   }
   return object
}