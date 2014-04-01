Event-Monitoring
================

Event monitoring system using Logstash + StatsD + Riemann

Logs are pushed to Logstash which then the filtered based on the filters and the filtered events are then passed to statsD for aggregation. StatsD then sends the aggregated to metrics to Graphite using its default backend and the received counters are also passed to Riemann using the custom Riemann backend. The metrics are then processed by Riemann and based the filters, it triggers the notification.
