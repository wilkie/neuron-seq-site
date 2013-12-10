from django.conf.urls import patterns, url

from pyramidal import views

urlpatterns = patterns('',
	#Index
	url(r'^$',views.index,name='index'),

	#Gene Views

	#Isoform Views
	url(r'^genes/(?P<gene_id>\w+)/isoforms/?$',views.geneIsoforms,name='isoform_index'),
	url(r'^genes/(?P<gene_id>\w+)/isoforms/(?P<isoform_id>[\w.]+)/?$',views.isoformDetail,name='isoform_show'),

	#Gene detail view
	url(r'^genes/(?P<gene_id>[\w.-]+)/?$',views.geneShow,name='gene_show'),

	#All Genes
	url(r'^genes/?$',views.geneIndex,name='gene_index'),

	#Cluster Views
	url(r'^clusters/?$',views.clusterIndex,name='cluster_index'),
	url(r'^clusters/(?P<cluster_id>\d+)/?$',views.clusterShow,name='cluster_show'),

	#Search
	url(r'^search/?$', views.search, name = 'search'),
)
