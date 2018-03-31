# S3PrefixMonitor

The purpose of this program is to monitor files in S3 buckets prefixes. This is useful when using S3 as a queue with different Prefix acting as statuses or stages. There are three ways you can monitor:

## Charts

Here you can see multi-line graphs showing how many files are in each bucket for a specific prefix every minute. Nice for tracking the volume spikes and dips at a glance.

## Raw Data

Here you can see a link to the raw files in each bucket for a specific prefix.

## Pipelines

Here you can watch files progress through the steps/stages of your process and easily identify problem files based on business rules you specify.

# Configuration

## AWS

https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html

## Settings

This is where you specify the S3 Buckets and Prefixes you want to monitor. There are two subsections you can configure:

### Charts

Charts are shown horizontally as a "row". You can have up to 12 charts in a row (they would be quite small) before they naturally wrap to a second row. Alternatively, you can create your own rows and add one or more chart configuration to each row. So, rather than having one row with 6 charts, you could make 3 rows with 2 charts each.

#### Row Configuration

You can specify a name for the row to differentiate each row on the Charts page. You can add Charts to the row.

#### Chart Configuration

You can specify a name for the Chart. You also specify the prefix and buckets the chart will show data for. The buckets field is accepts CSV.

### Pipelines

Coming soon!

