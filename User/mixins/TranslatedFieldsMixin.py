from rest_framework import serializers
from rest_framework.utils.model_meta import get_field_info

class TranslatedFieldMixin(serializers.Serializer):


    def get_translated_fields(self):
        info = get_field_info(self.Meta.model)           
        fields = self.get_fields()
        map = {}

        forward_rel = info.forward_relations
        other_field = info.fields
        reverse_rel = info.reverse_relations
        all_fields = {
                    **other_field, 
                    **{k: v.model_field for k, v in forward_rel.items()}, 
                    **{k: v.model_field for k, v in reverse_rel.items()}
                      }
        for field in all_fields.values():
            if getattr(field,"name",None) in fields:
                map[field.name] = field.verbose_name

        return map

    def to_representation(self, instance):
        represent = super().to_representation(instance)
        represent["fields"] = self.get_translated_fields()
        return represent