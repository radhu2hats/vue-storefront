import { readonly, ref, useContext } from '@nuxtjs/composition-api';
import { Logger } from '~/helpers/logger';
import type { CategorySearchQueryVariables, CategoryTree } from '~/modules/GraphQL/types';
import type { UseCategorySearchErrors, UseCategorySearchInterface } from './useCategorySearch';

/**
 * Allows searching for categories. It is
 * commonly used in subtrees navigation.
 *
 * See the {@link UseCategorySearchInterface} for a list of methods and values available in this composable.
 */
export function useCategorySearch(): UseCategorySearchInterface {
  const { app } = useContext();
  const loading = ref(false);
  const error = ref<UseCategorySearchErrors>({
    search: null,
  });
  const result = ref<CategoryTree[] | null>(null);

  const search = async (searchParams: CategorySearchQueryVariables) => {
    Logger.debug('useCategory/search', searchParams);

    try {
      loading.value = true;
      const { filters } = searchParams;
      const { data } = await app.context.$vsf.$magento.api.categorySearch({ filters });

      Logger.debug('[Result]:', { data });

      result.value = data.categoryList;
      error.value.search = null;
    } catch (err) {
      error.value.search = err;
      result.value = null;
      Logger.error('useCategory/search', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    search,
    loading: readonly(loading),
    error: readonly(error),
    result: readonly(result),
  };
}

export * from './useCategorySearch';
export default useCategorySearch;
